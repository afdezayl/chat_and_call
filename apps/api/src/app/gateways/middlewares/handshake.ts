import { AuthService } from '@chat-and-call/auth/data-access-auth-server';
import {
  HandshakeSCAction,
  HandshakeWSAction,
  MiddlewareHandshakeStrategy,
} from '@chat-and-call/socketcluster/adapter';
import { forwardRef, Inject, Injectable, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AGServer, AGServerSocket } from 'socketcluster-server';
import { setInterval } from 'timers';
import { CookieUtil } from './cookie-util';

type ConnectEvent = {
  id: string;
  pingTimeout: number;
  isAuthenticated: boolean;
  authError?: any;
};

@Injectable()
export class HandshakeStrategy extends MiddlewareHandshakeStrategy {
  constructor(
    private logger: ConsoleLogger,
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
      this._setRefreshTokenLogic(socket, validRefreshToken.username);
    } else {
      action.block(new Error('Unauthorized'));
      socket.disconnect();
      return;
    }
  }

  private async _setRefreshTokenLogic(
    socket: AGServerSocket,
    username: string
  ) {
    const connectStatus: ConnectEvent = await socket.listener('connect').once();

    await this._setToken(socket, { username });

    const tokenMinutes = this.config.get('JWT_EXPIRES_MIN');
    const secondsToRefresh = (tokenMinutes * 60) / 3;

    const interval = setInterval(
      async () => await this._setToken(socket, { username }),
      secondsToRefresh * 1000
    );

    for await (const x of socket.listener('close')) {
      clearInterval(interval);
      break;
    }
  }

  private async _setToken(
    socket: AGServerSocket,
    content: { username: string }
  ) {
    return await socket.setAuthToken(
      { ...content, id: socket.id },
      {
        expiresIn: `${this.config.get('JWT_EXPIRES_MIN')}min`,
      }
    );
  }
}
