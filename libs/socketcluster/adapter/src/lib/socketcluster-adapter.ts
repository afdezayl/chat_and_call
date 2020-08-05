import {
  WebSocketAdapter,
  Logger,
  INestApplication,
  WsMessageHandler,
} from '@nestjs/common';
import { attach, AGServer, AGServerSocket } from 'socketcluster-server';
import { Observable } from 'rxjs/internal/Observable';
import { AGServerOptions } from 'socketcluster-server/server';
import { IAGAction } from './IAGAction';
import { of, interval } from 'rxjs';
import { switchMap, tap, take } from 'rxjs/operators';
import { IAGRequest } from './IAGRequest';
import { Action } from 'rxjs/internal/scheduler/Action';
import * as cookieUtility from 'cookie';

// TODO: Recover interfaces
export class SocketClusterAdapter implements WebSocketAdapter {
  private _logger: Logger;
  private _server: AGServer;

  constructor(
    private _app: INestApplication,
    private _options: AGServerOptions
  ) {
    const logger: Logger = (_app as any).logger ?? new Logger();

    logger.setContext(this.constructor.name);
    this._logger = logger;
  }

  create(port: number, options?: AGServerOptions) {
    const httpServer = this._app.getHttpServer();

    if (!this._server) {
      this._server = attach(httpServer, this._options);
      this._logger.log('SocketCluster server created');
    }

    this._setInboundMiddleware();
    this._setConnectionLogs();
    // Signed cookies?
    //this._setHandshakeMiddleware();
    //this._interceptRawMessage();

    return this._server;
  }

  bindClientConnect(server: AGServer, callback: Function) {
    (async () => {
      for await (const { socket } of server.listener('connection')) {
        callback(socket);
      }
    })();
  }

  bindClientDisconnect?(client: AGServerSocket, callback: Function) {
    callback();
  }

  // TODO: Rethink procedure/receiver convention
  bindMessageHandlers(
    socket: AGServerSocket,
    handlers: WsMessageHandler<string>[],
    transform: (data: any) => Observable<any>
  ) {
    for (const { message, callback } of handlers) {
      const consumer = message.startsWith('#')
        ? socket.procedure(message)
        : socket.receiver(message);
      (async () => {
        for await (const request of consumer) {
          const req = request as IAGRequest;
          of(callback(request))
            .pipe(switchMap(transform))
            .subscribe((response) => {
              if (!req.sent) {
                req.end(response);
              }
            }, this._logger.error);
        }
      })();
    }
  }

  close(server: AGServer) {
    this._logger.log('closing server...');
    server.close();
  }

  private _setInboundMiddleware() {
    this._server.setMiddleware(
      this._server.MIDDLEWARE_INBOUND,
      async (middlewareStream: AsyncIterable<IAGAction>) => {
        for await (const action of middlewareStream) {
          switch (action.type) {
            case action.AUTHENTICATE:
              console.log('authenticate', action?.socket?.authState);
              action.allow();
              break;
            case action.SUBSCRIBE:
              this._logger.debug(`${action.type} - ${action.channel}`);
              action.allow();
              break;
            case action.TRANSMIT:
              this._logger.debug(`${action.type} - ${action.receiver}`);
              action.allow();
              break;
            case action.PUBLISH_IN:
              const user = action.socket?.authToken?.username;
              const channel = action.channel;
              console.log(action?.socket?.authToken?.username);
              action.data = {
                ...action.data,
                from: user,
                date: new Date(),
              };
              this._server.exchange.transmitPublish(channel, action.data);
              //console.log(action.allow.toString(), action['_resolve'].toString());
              action.block(null);
              break;
            default:
              action.allow();
          }
        }
      }
    );
  }

  private _setHandshakeMiddleware() {
    this._server.setMiddleware(
      this._server.MIDDLEWARE_HANDSHAKE,
      async (stream: AsyncIterable<IAGAction>) => {
        for await (const action of stream) {
          const request = action.request;
          console.log(action.type, action?.socket?.state);
          let cookies = action.request?.headers?.cookie ?? '';

          const parsed = cookies
            .split(';')
            .map((x) => x.trim())
            .map((x) => x.split('='))
            .reduce((acc, pair) => {
              const [key, value] = pair;
              acc[key] = value;
              return acc;
            }, {});

          console.log(parsed);

          action.allow();
        }
      }
    );
  }

  private _interceptRawMessage() {
    this._server.setMiddleware(
      this._server.MIDDLEWARE_INBOUND_RAW,
      async (stream: AsyncIterable<IAGAction>) => {
        for await (const action of stream) {
          const isHandshake = (action?.data as string).startsWith(
            '{"event":"#handshake"'
          );
          if (isHandshake) {
            try {
              const message = JSON.parse(action?.data);
              const token = message?.data?.authToken;
              console.log('handshake:', token);
              console.log(action.socket.isAuthTokenExpired(token));
            } catch (error) {
              action.block(new Error('Untrusted connection'));
            }
          }

          action.allow();
        }
      }
    );
  }

  private _setConnectionLogs() {
    (async () => {
      for await (const { socket, id } of this._server.listener('connection')) {
        this._logger.debug(
          'Clients: ' + this._server.clientsCount + ' -> connected - ' + id
        );
      }
    })();
    (async () => {
      for await (const { socket } of this._server.listener('disconnection')) {
        this._logger.debug('disconnected - ' + socket.id);
      }
    })();
    (async () => {
      for await (const { socket, authToken } of this._server.listener(
        'authentication'
      )) {
        const serverInstance = this._server.clients[socket.id];

        if (serverInstance.authState === serverInstance.AUTHENTICATED) {
          this._logger.debug(
            'authorized - ' +
              socket.id +
              ' - ' +
              socket.authState +
              ' - server: ' +
              this._server.clients[socket.id]['authState']
          );
        }

        if (serverInstance.authState === serverInstance.UNAUTHENTICATED) {
          await serverInstance.setAuthToken(authToken);
          this._logger.debug('second auth...');
        }
      }
    })();

    (async () => {
      for await (const {
        authError,
        signedAuthToken,
        socket,
      } of this._server.listener('badSocketAuthToken')) {
        const cookies = socket?.request?.headers?.cookie ?? '';
        const parsedCookies = cookieUtility.parse(cookies);

        console.log(authError, signedAuthToken, parsedCookies);
      }
    })();
  }
}
