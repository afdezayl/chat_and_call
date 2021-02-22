import { ChannelsDataAccessService } from '@chat-and-call/channels/data-access-server';
import {
  BasicMessage,
  ChannelType,
  CreateGroupChannelRequest,
  FileAcceptedDTO,
  FileChunkDTO,
  FileDispatch,
  FileInfoDTO,
  MessageDTO,
  ServerReceivedMessageDTO,
} from '@chat-and-call/channels/shared';
import {
  MAX_FILE_SIZE,
  CHUNK_SIZE_BYTES,
} from '@chat-and-call/socketcluster/shared';
import {
  AuthorizeGuard,
  SocketCrudGateway,
  SocketGet,
  SocketPost,
  SocketProcedure,
} from '@chat-and-call/socketcluster/utils-crud-server';
import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, WsException } from '@nestjs/websockets';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { AGServerSocket } from 'socketcluster-server';
import { v4 } from 'uuid';

@UseGuards(AuthorizeGuard)
@SocketCrudGateway('channels')
export class ChannelsGateway {
  constructor(
    private channelService: ChannelsDataAccessService,
    private logger: Logger
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @SocketGet()
  async getChannels(@ConnectedSocket() socket: AGServerSocket) {
    const user = socket?.authToken?.username;
    const channels = await this.channelService.getChannels(user);
    channels.forEach((ch) => socket.exchange.subscribe(ch.id));

    return channels;
  }

  @SocketPost('public')
  createPublicChannel(
    @ConnectedSocket() socket: AGServerSocket,
    @MessageBody() data: CreateGroupChannelRequest
  ) {
    const user = socket?.authToken?.username;

    throw new WsException('Unauthorized');
    return this.channelService.createChannel({
      title: data.title,
      type: ChannelType.Public,
      user,
    });
  }

  @SocketPost('private')
  createPrivateChannel(
    @ConnectedSocket() socket: AGServerSocket,
    @MessageBody() data: CreateGroupChannelRequest
  ) {
    const user = socket?.authToken?.username;
    return this.channelService.createChannel({
      title: data.title,
      type: ChannelType.Private,
      user,
    });
  }

  @SocketProcedure('publish')
  publishMessageWithResponse(
    @ConnectedSocket() socket: AGServerSocket,
    @MessageBody() data: BasicMessage
  ): ServerReceivedMessageDTO | Observable<ServerReceivedMessageDTO> {
    const user = socket?.authToken?.username;

    if (!socket.isSubscribed(data.channel)) {
      throw new WsException('Unauthorized');
    }

    const newMessage: MessageDTO = new MessageDTO({
      id: v4(),
      ...data,
      from: user,
      date: new Date().toISOString(),
    });

    // Defer publish action
    setTimeout(() => {
      socket.exchange.transmitPublish(data.channel, newMessage);
    }, 0);

    return new ServerReceivedMessageDTO({ id: newMessage.id });
  }

  @SocketPost('file_info')
  sendFile(
    @ConnectedSocket() socket: AGServerSocket,
    @MessageBody() data: FileDispatch
  ): Observable<FileAcceptedDTO> | FileAcceptedDTO {
    if (data.size > MAX_FILE_SIZE || !socket.isSubscribed(data.channel)) {
      console.log(MAX_FILE_SIZE, data.size);
      throw new WsException(`Max file size is ${MAX_FILE_SIZE}`);
    }

    const id = v4();

    const toPublish: FileInfoDTO = new FileInfoDTO({
      from: socket.authToken?.username,
      filename: data.filename,
      size: data.size,
      id,
      channel: data.channel,
      checksum: data.checksum,
      type: data.type,
    });

    setTimeout(
      () =>
        socket.exchange.transmitPublish(`${data.channel}/file_info`, toPublish),
      0
    );

    return new FileAcceptedDTO({ id });
  }

  @SocketProcedure('file_chunk')
  async publishChunk(
    @ConnectedSocket() socket: AGServerSocket,
    @MessageBody() chunk: FileChunkDTO
  ) {
    /* if (chunk.chunk.byteLength > CHUNK_SIZE_BYTES) {
      console.log('file chunk...');
      throw new WsException(`Max file chunk is ${CHUNK_SIZE_BYTES}`);
    } */

    setTimeout(
      () => socket.exchange.transmitPublish(`${chunk.channel}/file`, chunk),
      0
    );

    console.log('-->', chunk.order);
    return new ServerReceivedMessageDTO({
      id: chunk.order + '->' + chunk.id,
    });
  }

  @SocketPost('call')
  call(@ConnectedSocket() socket: AGServerSocket, @MessageBody() data: any) {
    console.log(data);
    const username = socket?.authToken?.username;

    // TODO: check if target user is current user contact

    return of(EMPTY).pipe(
      switchMap(() =>
        socket.server.exchange.invokePublish(`${data.to}-call`, {
          from: username,
          streamCandidate: data.candidate,
        })
      ),
      retry(3),
      catchError((err) => {
        this.logger.error(err);
        return throwError('Unavailable');
      })
    );

    //socket.server.exchange
    return data;
  }
}
