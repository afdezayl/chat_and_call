import {
  Inject,
  Injectable,
  Logger,
  Optional,
  WebSocketAdapter,
  WsMessageHandler,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as cookieUtility from 'cookie';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/operators';
import { AGServer, AGServerSocket, attach } from 'socketcluster-server';
import { AGServerOptions } from 'socketcluster-server/server';
import { AGAction, IAGRequest } from './interfaces';
import {
  MiddlewareHandshakeStrategy,
  MIDDLEWARE_HANDSHAKE_TOKEN,
} from './middlewares/middleware-handshake-strategy';
import {
  MiddlewareInboundRawStrategy,
  MIDDLEWARE_INBOUND_RAW_TOKEN,
} from './middlewares/middleware-inbound-raw-strategy';
import {
  MiddlewareInboundStrategy,
  MIDDLEWARE_INBOUND_TOKEN,
} from './middlewares/middleware-inbound-strategy';
import {
  MiddlewareOutboundStrategy,
  MIDDLEWARE_OUTBOUND_TOKEN,
} from './middlewares/middleware-outbound-strategy';

export const SOCKETCLUSTER_OPTIONS_TOKEN = 'SOCKETCLUSTER_SERVER_OPTIONS';

@Injectable()
export class SocketClusterAdapter implements WebSocketAdapter {
  private _server: AGServer;

  constructor(
    private logger: Logger,
    private readonly adapterHost: HttpAdapterHost,
    @Inject(SOCKETCLUSTER_OPTIONS_TOKEN) private _options: AGServerOptions,
    @Optional()
    @Inject(MIDDLEWARE_HANDSHAKE_TOKEN)
    private handshake: MiddlewareHandshakeStrategy,
    @Optional()
    @Inject(MIDDLEWARE_INBOUND_RAW_TOKEN)
    private inbound_raw: MiddlewareInboundRawStrategy,
    @Optional()
    @Inject(MIDDLEWARE_INBOUND_TOKEN)
    private inbound: MiddlewareInboundStrategy,
    @Optional()
    @Inject(MIDDLEWARE_OUTBOUND_TOKEN)
    private outbound: MiddlewareOutboundStrategy
  ) {
    this.logger.setContext(this.constructor.name);
  }

  get server() {
    return this._server;
  }

  create(port: number, options?: AGServerOptions) {
    const httpServer = this.adapterHost.httpAdapter.getHttpServer();

    if (!this._server) {
      this._server = attach(httpServer, this._options);
      this.logger.log('SocketCluster server created');
    }
    this._setHandshakeMiddleware(this.handshake);
    this._setInboundMiddleware(this.inbound);
    this._setInboundRawMiddleware(this.inbound_raw);
    this._setOutboundMiddleware(this.outbound);

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
    for (const handler of handlers) {
      const { message, callback } = handler;
      const isProcedure = message.startsWith('#');

      const consumer = isProcedure
        ? socket.procedure(message)
        : socket.receiver(message);
      (async () => {
        for await (const request of consumer) {
          const req = request as IAGRequest;
          of(callback(request))
            .pipe(switchMap(transform))
            .subscribe(
              (response) => {
                if (isProcedure && !req.sent) {
                  req.end(response);
                }
              },
              (err) => this.logger.error(err)
            );
        }
      })();
    }
  }

  close(server: AGServer) {
    this.logger.log('closing server...');
    server.close();
  }

  private _setHandshakeMiddleware(handshake: MiddlewareHandshakeStrategy) {
    if (handshake) {
      this.logger.debug(`Handshake middleware - ${handshake.constructor.name}`);

      if (handshake.onServer) {
        this.logger.debug(
          `Raw server middleware - ${handshake.constructor.name}`
        );
        handshake.onServer(this.server);
      }

      this._server.setMiddleware(
        this._server.MIDDLEWARE_HANDSHAKE,
        async (stream: AsyncIterable<AGAction>) => {
          for await (const action of stream) {
            this._handleHandshakeAction(action, handshake);
          }
        }
      );
    }
  }

  private _handleHandshakeAction(
    action: AGAction,
    handshake: MiddlewareHandshakeStrategy
  ) {
    switch (action.type) {
      case action.HANDSHAKE_WS:
        handshake.onWSHandshake
          ? handshake.onWSHandshake(action)
          : handshake.default(action);
        break;
      case action.HANDSHAKE_SC:
        handshake.onSCHandshake
          ? handshake.onSCHandshake(action)
          : handshake.default(action);
        break;
      default:
        this.logger.warn(`Not implemented type "${action.type}"!`);
        handshake.default(action);
    }
  }

  private _setInboundRawMiddleware(inboundRaw: MiddlewareInboundRawStrategy) {
    if (inboundRaw) {
      this.logger.debug('Inbound raw - ' + inboundRaw.constructor.name);

      this._server.setMiddleware(
        this._server.MIDDLEWARE_INBOUND_RAW,
        async (stream: AsyncIterable<AGAction>) => {
          for await (const action of stream) {
            this._handleInboundRawAction(action, inboundRaw);
          }
        }
      );
    }
  }

  private _handleInboundRawAction(
    action: AGAction,
    inboundRaw: MiddlewareInboundRawStrategy
  ) {
    switch (action.type) {
      case action.MESSAGE:
        inboundRaw.onMessage(action);
        break;
      default:
        this.logger.warn(`Not implemented type "${action.type}"!`);
        action.allow();
    }
  }

  private _setInboundMiddleware(inbound: MiddlewareInboundStrategy) {
    if (inbound) {
      this.logger.debug('Middleware inbound -> ' + inbound.constructor.name);

      this._server.setMiddleware(
        this._server.MIDDLEWARE_INBOUND,
        async (middlewareStream: AsyncIterable<AGAction>) => {
          for await (const action of middlewareStream) {
            this._handleInboundAction(action, inbound);
          }
        }
      );
    }
  }

  private _handleInboundAction(
    action: AGAction,
    inbound: MiddlewareInboundStrategy
  ) {
    switch (action.type) {
      case action.AUTHENTICATE:
        inbound.onAuthenticate
          ? inbound.onAuthenticate(action)
          : inbound.default(action);
        break;
      case action.SUBSCRIBE:
        inbound.onSubscribe
          ? inbound.onSubscribe(action)
          : inbound.default(action);
        break;
      case action.TRANSMIT:
        inbound.onTransmit ? inbound.onTransmit(action) : inbound.default;
        break;
      case action.INVOKE:
        inbound.onInvoke ? inbound.onInvoke(action) : inbound.default(action);
        break;
      case action.PUBLISH_IN:
        inbound.onPublishIn
          ? inbound.onPublishIn(action)
          : inbound.default(action);
        break;
      default:
        this.logger.warn(`Not implemented type "${action.type}"!`);
        inbound.default(action);
    }
  }

  private _setOutboundMiddleware(outbound: MiddlewareOutboundStrategy) {
    if (outbound) {
      this.logger.debug('Inbound raw - ' + outbound.constructor.name);

      this._server.setMiddleware(
        this._server.MIDDLEWARE_OUTBOUND,
        async (stream: AsyncIterable<AGAction>) => {
          for await (const action of stream) {
            this._handleOutboundAction(action, outbound);
          }
        }
      );
    }
  }

  private _handleOutboundAction(
    action: AGAction,
    outbound: MiddlewareOutboundStrategy
  ) {
    switch (action.type) {
      case action.PUBLISH_OUT:
        outbound.onPublishOut(action);
        break;
      default:
        this.logger.warn(`Not implemented type "${action.type}"!`);
        action.allow();
    }
  }

  private _setConnectionLogs() {
    (async () => {
      for await (const { socket, id } of this._server.listener('connection')) {
        console.log(
          'Clients: ' + this._server.clientsCount + ' -> connected - ' + id
        );
      }
    })();
    (async () => {
      for await (const { socket } of this._server.listener('disconnection')) {
        console.log('disconnected - ' + socket.id);
      }
    })();
    (async () => {
      for await (const { socket, authToken } of this._server.listener(
        'authentication'
      )) {
        const serverInstance = this._server.clients[socket.id];

        if (serverInstance.authState === serverInstance.AUTHENTICATED) {
          console.log(
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
          console.log('second auth...');
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
