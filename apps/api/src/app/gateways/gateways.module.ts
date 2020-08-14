import { AuthDataAccessModule } from '@chat-and-call/auth/data-access-auth-server';
import { ChannelsDataAccessModule } from '@chat-and-call/channels/data-access-server';
import { ServerContactsModule } from '@chat-and-call/contacts/feature-server-contacts';
import { SocketClusterAdapterModule } from '@chat-and-call/socketcluster/adapter';
import { SOCKET_PATH } from '@chat-and-call/socketcluster/shared';
import { Module } from '@nestjs/common';
import { AuthGateway } from './auth.gateway';
import { ChannelsGateway } from './channels.gateway';
import { MockMiddleware } from './middlewares/inbound-middleware';

@Module({
  imports: [
    AuthDataAccessModule,
    ChannelsDataAccessModule,
    ServerContactsModule,
    SocketClusterAdapterModule.forRoot(
      {
        path: SOCKET_PATH,
        authKey: 'patata', //config.get('JSON_WEBTOKEN_KEY'),
        socketChannelLimit: 1000,
        origins: '*:*',
        authDefaultExpiry: 120 * 60, //config.get('JWT_EXPIRES_MIN') * 60,
        allowClientPublish: false,
      },
      { inbound: MockMiddleware }
    ),
  ],
  providers: [AuthGateway, ChannelsGateway],
  exports: [],
})
export class GatewaysModule {}
