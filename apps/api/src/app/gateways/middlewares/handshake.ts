import { AuthService } from '@chat-and-call/auth/data-access-auth-server';
import {
  HandshakeSCAction,
  MiddlewareHandshakeStrategy,
} from '@chat-and-call/socketcluster/adapter';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import * as cookieUtility from 'cookie';
import * as cookieParser from 'cookie-parser';
import { from, of, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AGServer } from 'socketcluster-server';
import { IncomingMessage } from 'http';
import { ConfigService } from '@nestjs/config';

type ConnectEvent = {
  id: string;
  pingTimeout: number;
  isAuthenticated: boolean;
};

@Injectable()
export class HandshakeStrategy extends MiddlewareHandshakeStrategy {
  constructor(
    private logger: Logger,
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
  onSCHandshake(action: HandshakeSCAction) {
    const socket = action.socket;
    const signedCookies = this.getSignedCookiesFromRequest(action.request);

    // Remove falsy values, don´t use coalesce operator (??)
    const refreshToken = signedCookies?.refresh_jwt || null;
    const authToken = signedCookies?.jwt || null;

    //console.log(refreshToken, authToken);

    const tryRefresh$ = of(EMPTY).pipe(
      switchMap(() => this.authService.validateToken(refreshToken)),
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

  private getSignedCookiesFromRequest(request: IncomingMessage) {
    // Cookie parser middleware not applied, socketcluster intercepts handshake request
    const rawCookies = request?.headers?.cookie ?? '';
    const cookies = cookieUtility.parse(rawCookies);
    const signedCookies = cookieParser.signedCookies(cookies, [
      this.config.get('COOKIE_SECRET'),
    ]);

    return signedCookies;
  }
}
