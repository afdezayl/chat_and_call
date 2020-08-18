import { AuthDataAccessModule } from '@chat-and-call/auth/data-access-auth-server';
import { ChannelsDataAccessModule } from '@chat-and-call/channels/data-access-server';
import { ServerContactsModule } from '@chat-and-call/contacts/feature-server-contacts';
import { Module } from '@nestjs/common';
import { AuthGateway } from './auth.gateway';
import { ChannelsGateway } from './channels.gateway';
import { HandshakeStrategy } from './middlewares/handshake';

@Module({
  imports: [
    AuthDataAccessModule,
    ChannelsDataAccessModule,
    ServerContactsModule,
  ],
  providers: [AuthGateway, ChannelsGateway, HandshakeStrategy],
  exports: [HandshakeStrategy],
})
export class GatewaysModule {}
