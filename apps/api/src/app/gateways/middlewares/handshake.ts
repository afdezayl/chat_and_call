import { AuthService } from '@chat-and-call/auth/data-access-auth-server';
import {
  HandshakeSCAction,
  MiddlewareHandshakeStrategy,
} from '@chat-and-call/socketcluster/adapter';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import * as cookieUtility from 'cookie';
import { from, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AGServer } from 'socketcluster-server';

type ConnectEvent = {
  id: string;
  pingTimeout: number;
  isAuthenticated: boolean;
};

@Injectable()
export class HandshakeStrategy extends MiddlewareHandshakeStrategy {
  constructor(
    private logger: Logger,
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
  onSCHandshake(action: HandshakeSCAction) {
    const socket = action.socket;
    const rawCookies = action.request?.headers?.cookie ?? '';
    const cookies = cookieUtility.parse(rawCookies);

    const refreshToken = cookies?.refresh_jwt ?? null;

    const tryRefresh$ = from(this.authService.validateToken(refreshToken)).pipe(
      switchMap((decoded) =>
        this.authService.getTokenContent(decoded.username)
      ),
      switchMap((content) => socket.setAuthToken(content)),
      catchError((err) => throwError(new Error('Unauthorized')))
    );

    // Disconnect client if token is not valid
    from(socket.listener('connect').once())
      .pipe(
        switchMap((data: ConnectEvent) =>
          data.isAuthenticated ? of(data) : tryRefresh$
        )
      )
      .subscribe(
        (data) =>
          this.logger.log(
            `Connected => ${socket?.authToken?.username}, id: ${socket.id}`
          ),
        (err) => socket.disconnect()
      );

    action.allow();
  }
}
