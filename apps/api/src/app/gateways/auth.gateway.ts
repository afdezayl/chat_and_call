import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Logger, NotImplementedException } from '@nestjs/common';
import {
  SocketCrudGateway,
  SocketPost,
} from '@chat-and-call/socketcluster/utils-crud-server';
import { AGServerSocket } from 'socketcluster-server';

import { AuthService } from '@chat-and-call/auth/data-access-auth-server';
import {
  LoginRequestDto,
  SignupRequestDto,
} from '@chat-and-call/auth/shared-auth-interfaces';

@SocketCrudGateway('auth')
export class AuthGateway {
  constructor(private logger: Logger, private authService: AuthService) {
    this.logger.setContext(this.constructor.name);
  }

  @SocketPost('login')
  async login(
    @MessageBody() data: LoginRequestDto,
    @ConnectedSocket() socket: AGServerSocket
  ) {
    // TODO: mysql database docker volume
    /* const isValid = await this.authService.validateUserCredentials(
      data.username,
      data.password
    ); */
    const isValid = data.username === 'root' && data.password === '1234';
    if (isValid) {
      await socket.setAuthToken({ username: data.username });

      this.logger.debug(
        `${data.username} login... -> ${socket.id} - server: ${
          socket.server.clients[socket.id]['authState']
        }`
      );

      return socket.ok(socket.authToken);
    }

    return socket.error('Unauthorized');
  }

  @SocketPost('signup')
  async signup(
    @MessageBody() data: SignupRequestDto,
    @ConnectedSocket() socket: AGServerSocket
  ) {
    throw new WsException('not implemented');
  }
}
