import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
  Type,
} from '@nestjs/common';
import { AGServerOptions } from 'socketcluster-server/server';
import { MiddlewareOutboundStrategy } from './middlewares';
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
import { MIDDLEWARE_OUTBOUND_TOKEN } from './middlewares/middleware-outbound-strategy';
import {
  SocketClusterAdapter,
  SOCKETCLUSTER_OPTIONS_TOKEN,
} from './socketcluster-adapter';

@Module({})
export class SocketClusterAdapterModule {
  static forRoot(
    options: AGServerOptions,
    middlewares?: SocketClusterMiddlewares
  ): DynamicModule {
    return {
      module: SocketClusterAdapterModule,
      exports: [SocketClusterAdapter],
      imports: [],
      providers: [
        SocketClusterAdapter,
        {
          provide: SOCKETCLUSTER_OPTIONS_TOKEN,
          useValue: options,
        },
        ...this.createMiddlewaresProviders(middlewares),
      ],
    };
  }

  static forRootAsync(
    options: SocketclusterAsyncOptions,
    middlewares?: SocketClusterMiddlewares
  ): DynamicModule {
    return {
      module: SocketClusterAdapterModule,
      imports: options.imports || [],
      exports: [SocketClusterAdapter],
      providers: [
        SocketClusterAdapter,
        ...this.createAsyncOptionsProvider(options),
        ...this.createMiddlewaresProviders(middlewares),
      ],
    };
  }

  private static createAsyncOptionsProvider(
    options: SocketclusterAsyncOptions
  ): Array<Provider> {
    return [
      {
        provide: SOCKETCLUSTER_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];
  }

  private static createMiddlewaresProviders(
    middlewares?: SocketClusterMiddlewares
  ): Array<Provider> {
    return [
      {
        provide: MIDDLEWARE_HANDSHAKE_TOKEN,
        //useClass: middlewares?.handshake,
        useExisting: middlewares?.handshake,
      },
      {
        provide: MIDDLEWARE_INBOUND_RAW_TOKEN,
        useExisting: middlewares?.inboundRaw,
      },
      {
        provide: MIDDLEWARE_INBOUND_TOKEN,
        useExisting: middlewares?.inbound,
      },
      {
        provide: MIDDLEWARE_OUTBOUND_TOKEN,
        useExisting: middlewares?.outbound,
      },
    ];
  }
}

export interface SocketclusterAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<AGServerOptions> | AGServerOptions;
  inject?: any[];
}

export interface SocketClusterMiddlewares {
  handshake?: Type<MiddlewareHandshakeStrategy>;
  inboundRaw?: Type<MiddlewareInboundRawStrategy>;
  inbound?: Type<MiddlewareInboundStrategy>;
  outbound?: Type<MiddlewareOutboundStrategy>;
}
