import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { SocketGet } from '@chat-and-call/socketcluster/utils-crud-server';

@WebSocketGateway()
export class DevTestsGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
