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
import { of } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { IAGRequest } from './IAGRequest';

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
            }, console.error);
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
            case action.SUBSCRIBE:
              this._logger.debug(`${action.type} - ${action.channel}`);
              action.allow();
              break;
            case action.TRANSMIT:
              this._logger.debug(`${action.type} - ${action.receiver}`);
              action.allow();
              break;
            default:
              action.allow();
          }
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
  }
}
