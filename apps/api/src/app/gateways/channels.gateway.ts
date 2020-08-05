import {
  SocketCrudGateway,
  SocketGet,
} from '@chat-and-call/socketcluster/utils-crud-server';
import { ChannelsDataAccessService } from '@chat-and-call/channels/data-access-server';
import { ConnectedSocket } from '@nestjs/websockets';
import { AGServerSocket } from 'socketcluster-server';

@SocketCrudGateway('channels')
export class ChannelsGateway {
  constructor(private channelService: ChannelsDataAccessService) {}
  @SocketGet('')
  async getChannels(@ConnectedSocket() socket: AGServerSocket) {
    // TODO: Recover from token
    const user = socket?.authToken?.username;
    console.log('CHANNELS - FIX THIS!!!!: ', user);
    return await this.channelService.getChannels('admin');
  }
}
