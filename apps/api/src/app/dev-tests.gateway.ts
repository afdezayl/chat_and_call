import { ConnectedSocket, MessageBody, WsResponse } from '@nestjs/websockets';
import {
  SocketGet,
  SocketCrudGateway,
  SocketPost,
} from '@chat-and-call/socketcluster/utils-crud-server';
import { AGServerSocket } from 'socketcluster-server';
import { Logger } from '@nestjs/common';

@SocketCrudGateway('dev')
export class DevTestsGateway {
  constructor(private logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  @SocketGet('message')
  greeting(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AGServerSocket
  ): string {
    return 'Hello world!';
  }

  @SocketPost('echo')
  echo(@MessageBody() data: any) {
    return data;
  }

  @SocketPost('noparams')
  noParams() {
    return 'noparams';
  }
}
