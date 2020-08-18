import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketClusterAdapterModule } from 'libs/socketcluster/adapter/src/lib';
import { SOCKET_PATH } from 'libs/socketcluster/shared/src/lib';
import { ControllersModule } from './api/controllers/controllers.module';
import { DevTestsGateway } from './dev-tests.gateway';
import { GatewaysModule } from './gateways/gateways.module';
import { HandshakeStrategy } from './gateways/middlewares/handshake';
import { InboundStrategy } from './gateways/middlewares/inbound-middleware';
import { LoggerModule } from './logger/logger.module';
import { AuthDataAccessModule } from '@chat-and-call/auth/data-access-auth-server';

@Module({
  providers: [DevTestsGateway],
  imports: [
    ConfigModule.forRoot(),
    ControllersModule,
    DatabasePoolModule,
    GatewaysModule,
    LoggerModule,
    SocketClusterAdapterModule.forRootAsync(
      {
        imports: [ConfigModule, GatewaysModule],
        inject: [ConfigService, HandshakeStrategy],
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
  controllers: [],
})
export class AppModule {}
