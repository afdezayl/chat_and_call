import { ChannelsDataAccessService } from '@chat-and-call/channels/data-access-server';
import {
  BasicMessage,
  ChannelType,
  CreateChannelRequest,
} from '@chat-and-call/channels/shared';
import {
  AuthorizeGuard,
  SocketCrudGateway,
  SocketGet,
  SocketPost,
  SocketProcedure,
} from '@chat-and-call/socketcluster/utils-crud-server';
import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, WsException } from '@nestjs/websockets';
import { EMPTY, from, of, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { AGServerSocket } from 'socketcluster-server';

@UseGuards(AuthorizeGuard)
@SocketCrudGateway('channels')
export class ChannelsGateway {
  constructor(
    private channelService: ChannelsDataAccessService,
    private logger: Logger
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @SocketGet('')
  async getChannels(@ConnectedSocket() socket: AGServerSocket) {
    const user = socket?.authToken?.username;
    const channels = await this.channelService.getChannels(user);
    channels.forEach((ch) => socket.exchange.subscribe(ch.id));

    return channels;
  }

  @SocketPost('public')
  createPublicChannel(
    @ConnectedSocket() socket: AGServerSocket,
    @MessageBody() data: CreateChannelRequest
  ) {
    const user = socket?.authToken?.username;

    throw Error('Unauthorized');
    return this.channelService.createChannel({
      title: data.title,
      type: ChannelType.Public,
      user,
    });
  }

  @SocketPost('private')
  createPrivateChannel(
    @ConnectedSocket() socket: AGServerSocket,
    @MessageBody() data: CreateChannelRequest
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
  ) {
    const channels: Array<string> = socket?.authToken?.channels ?? [];
    const user = socket?.authToken?.username;

    /* if (channels.includes(data.channel) === false) {
      throw new WsException('Unauthorized');
    } */

    const newMessage = {
      ...data,
      from: user,
      date: new Date(),
    };

    return from(
      socket.server.exchange.transmitPublish(data.channel, newMessage)
    );
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
