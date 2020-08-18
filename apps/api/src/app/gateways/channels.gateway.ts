import { ChannelsDataAccessService } from '@chat-and-call/channels/data-access-server';
import { BasicMessage } from '@chat-and-call/channels/shared';
import {
  AuthorizeGuard,
  SocketCrudGateway,
  SocketGet,
  SocketPost,
  SocketProcedure,
} from '@chat-and-call/socketcluster/utils-crud-server';
import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, WsException } from '@nestjs/websockets';
import { from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AGServerSocket } from 'socketcluster-server';

@UseGuards(AuthorizeGuard)
@SocketCrudGateway('channels')
export class ChannelsGateway {
  constructor(private channelService: ChannelsDataAccessService) {}

  @SocketGet('')
  async getChannels(@ConnectedSocket() socket: AGServerSocket) {
    const user = socket?.authToken?.username;
    return await this.channelService.getChannels(user);
  }

  @SocketProcedure('publish')
  publishMessageWithResponse(
    @ConnectedSocket() socket: AGServerSocket,
    @MessageBody() data: BasicMessage
  ) {
    const channels: Array<string> = socket?.authToken?.channels ?? [];
    const user = socket?.authToken?.username;

    if (channels.includes(data.channel) === false) {
      throw new WsException('Unauthorized');
    }

    const newMessage = {
      ...data,
      from: user,
      date: new Date(),
    };

    return from(
      socket.server.exchange.transmitPublish(data.channel, newMessage)
    );
    //return newMessage;
  }

  @SocketPost('call')
  call(@ConnectedSocket() socket: AGServerSocket, @MessageBody() data: any) {
    console.log(data);
    //socket.server.exchange
    return data;
  }
}
