import { AuthDataAccessModule } from '@chat-and-call/auth/data-access-auth-server';
import { ChannelsDataAccessModule } from '@chat-and-call/channels/data-access-server';
import { ServerContactsModule } from '@chat-and-call/contacts/feature-server-contacts';
import { SocketClusterAdapterModule } from '@chat-and-call/socketcluster/adapter';
import {
  ProtobufCodecEngine,
  SOCKET_PATH,
} from '@chat-and-call/socketcluster/shared';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { environment } from '../../environments/environment';
import { AuthGateway } from './auth.gateway';
import { ChannelsGateway } from './channels.gateway';
import { CookieUtil } from './middlewares/cookie-util';
import { HandshakeStrategy } from './middlewares/handshake';
import { InboundStrategy } from './middlewares/inbound-middleware';
import { OutboundStrategy } from './middlewares/outbound-middleware';
import { RawStrategy } from './middlewares/raw-middleware';

@Module({
  imports: [
    AuthDataAccessModule,
    ChannelsDataAccessModule,
    ConfigModule,
    ServerContactsModule,
    SocketClusterAdapterModule.forRootAsync(
      {
        imports: [ConfigModule, GatewaysModule],
        inject: [
          ConfigService,
          HandshakeStrategy,
          InboundStrategy,
          RawStrategy,
          OutboundStrategy,
        ],
        useFactory: async (config: ConfigService) => ({
          path: SOCKET_PATH,
          authKey: config.get('JSON_WEBTOKEN_KEY'),
          socketChannelLimit: 1000,
          origins: '*:*',
          authDefaultExpiry: config.get('JWT_EXPIRES_MIN') * 60,
          allowClientPublish: false,
          codecEngine: new ProtobufCodecEngine({debug: !environment.production}),
        }),
      },
      {
        handshake: HandshakeStrategy,
        inbound: InboundStrategy,
        inboundRaw: RawStrategy,
        outbound: OutboundStrategy,
      }
    ),
  ],
  providers: [
    AuthGateway,
    ChannelsGateway,
    HandshakeStrategy,
    InboundStrategy,
    OutboundStrategy,
    RawStrategy,
    CookieUtil,
  ],
  exports: [HandshakeStrategy, InboundStrategy, RawStrategy, OutboundStrategy],
})
export class GatewaysModule {}
