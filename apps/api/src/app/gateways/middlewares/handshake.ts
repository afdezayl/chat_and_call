import { AuthService } from '@chat-and-call/auth/data-access-auth-server';
import {
  HandshakeSCAction,
  HandshakeWSAction,
  MiddlewareHandshakeStrategy,
} from '@chat-and-call/socketcluster/adapter';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AGServer } from 'socketcluster-server';
import { CookieUtil } from './cookie-util';

type ConnectEvent = {
  id: string;
  pingTimeout: number;
  isAuthenticated: boolean;
};

@Injectable()
export class HandshakeStrategy extends MiddlewareHandshakeStrategy {
  constructor(
    private logger: Logger,
    private cookie: CookieUtil,
    private config: ConfigService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService
  ) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  onServer(server: AGServer) {
    /* (async () => {
      for await (const x of server.listener('connection')) {
        this.logger.log('init -> ' + x.id);
      }
    })(); */
  }

  // TODO: unified type of errors
  async onSCHandshake(action: HandshakeSCAction) {
    const socket = action.socket;

    const refreshToken =
      this.cookie.getRefreshTokenFromRequest(action.request) || '';

    const validRefreshToken = await this.authService.validateToken(
      refreshToken
    );

    if (validRefreshToken?.username) {
      action.allow();
    } else {
      action.block(new Error('Unauthorized'));
      socket.disconnect();
      return;
    }

    const connectStatus: {
      id: string;
      pingTimeout: number;
      isAuthenticated: boolean;
      authError?: any;
    } = await socket.listener('connect').once();

    if (connectStatus.isAuthenticated) {
      return;
    }

    // Attach a new token if expired.
    socket.setAuthToken(
      { username: validRefreshToken.username, id: socket.id },
      { expiresIn: `${this.config.get('JWT_EXPIRES_MIN')}min` }
    );

    // TODO: Refresh token
  }
}
