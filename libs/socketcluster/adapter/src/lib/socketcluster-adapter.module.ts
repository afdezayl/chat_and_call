import { DynamicModule, Module, Type } from '@nestjs/common';
import { AGServerOptions } from 'socketcluster-server/server';
import {
  MiddlewareInboundStrategy,
  MIDDLEWARE_INBOUND_TOKEN,
} from './middlewares/middleware-inbound-strategy';
import {
  SocketClusterAdapter,
  SOCKETCLUSTER_OPTIONS_TOKEN,
} from './socketcluster-adapter';
import {
  MiddlewareHandshakeStrategy,
  MIDDLEWARE_HANDSHAKE_TOKEN,
} from './middlewares/middleware-handshake-strategy';
import {
  MiddlewareInboundRawStrategy,
  MIDDLEWARE_INBOUND_RAW_TOKEN,
} from './middlewares/middleware-inbound-raw-strategy';
import { MiddlewareOutboundStrategy } from './middlewares';
import { MIDDLEWARE_OUTBOUND_TOKEN } from './middlewares/middleware-outbound-strategy';

@Module({})
export class SocketClusterAdapterModule {
  static forRoot(
    options: AGServerOptions,
    middlewares?: SocketClusterMiddlewares
  ): DynamicModule {
    return {
      module: SocketClusterAdapterModule,
      exports: [],
      imports: [],
      providers: [
        SocketClusterAdapter,
        {
          provide: SOCKETCLUSTER_OPTIONS_TOKEN,
          useValue: options,
        },
        {
          provide: MIDDLEWARE_HANDSHAKE_TOKEN,
          useClass: middlewares?.handshake,
        },
        {
          provide: MIDDLEWARE_INBOUND_RAW_TOKEN,
          useClass: middlewares?.inboundRaw,
        },
        {
          provide: MIDDLEWARE_INBOUND_TOKEN,
          useClass: middlewares?.inbound,
        },
        {
          provide: MIDDLEWARE_OUTBOUND_TOKEN,
          useClass: middlewares?.outbound,
        },
      ],
    };
  }
}

export class SocketClusterMiddlewares {
  handshake?: Type<MiddlewareHandshakeStrategy>;
  inboundRaw?: Type<MiddlewareInboundRawStrategy>;
  inbound?: Type<MiddlewareInboundStrategy>;
  outbound?: Type<MiddlewareOutboundStrategy>;
}
