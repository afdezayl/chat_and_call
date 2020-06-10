import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import {
  SocketGet,
  SocketCrudGateway,
  SocketPost,
} from '@chat-and-call/socketcluster/utils-crud-server';
import { AGServerSocket } from 'socketcluster-server';

@SocketCrudGateway('dev')
export class DevTestsGateway {
  @SocketGet('message')
  greeting(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AGServerSocket
  ): string {
    return 'Hello world!';
  }

  @SocketPost('echo')
  echo(@MessageBody() data: any, @ConnectedSocket() socket: AGServerSocket) {
    return data;
  }

  @SocketGet('no-params')
  noParams() {
    return;
  }
}
