import { MessageBody, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
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
    const isValid = await this.authService.validateUserCredentials(
      data.username,
      data.password
    );
    if (isValid) {
      await socket.setAuthToken({ username: data.username });

      this.logger.debug(
        `${data.username} login... -> ${socket.id} - server: ${
          socket.server.clients[socket.id]['authState']
        }`
      );

      return socket.authToken;
    }

    throw new WsException('Unauthorized');
  }

  @SocketPost('signup')
  async signup(@MessageBody() data: SignupRequestDto) {
    throw new WsException('not implemented');
  }
}
