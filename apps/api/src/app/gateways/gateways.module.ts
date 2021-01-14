import { AuthDataAccessModule } from '@chat-and-call/auth/data-access-auth-server';
import { ChannelsDataAccessModule } from '@chat-and-call/channels/data-access-server';
import { ServerContactsModule } from '@chat-and-call/contacts/feature-server-contacts';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketClusterAdapterModule } from 'libs/socketcluster/adapter/src/lib';
import { SOCKET_PATH } from 'libs/socketcluster/shared/src/lib';
import { AuthGateway } from './auth.gateway';
import { ChannelsGateway } from './channels.gateway';
import { HandshakeStrategy } from './middlewares/handshake';
import { InboundStrategy } from './middlewares/inbound-middleware';

@Module({
  imports: [
    AuthDataAccessModule,
    ChannelsDataAccessModule,
    ConfigModule,
    ServerContactsModule,
    SocketClusterAdapterModule.forRootAsync(
      {
        imports: [ConfigModule, GatewaysModule],
        inject: [ConfigService, HandshakeStrategy, InboundStrategy],
        useFactory: async (config: ConfigService) => ({
          path: SOCKET_PATH,
          authKey: config.get('JSON_WEBTOKEN_KEY'),
          socketChannelLimit: 1000,
          origins: '*:*',
          authDefaultExpiry: config.get('JWT_EXPIRES_MIN') * 60,
          allowClientPublish: false,
        }),
      },
      {
        handshake: HandshakeStrategy,
        inbound: InboundStrategy,
      }
    ),
  ],
  providers: [AuthGateway, ChannelsGateway, HandshakeStrategy, InboundStrategy],
  exports: [HandshakeStrategy, InboundStrategy],
})
export class GatewaysModule {}
