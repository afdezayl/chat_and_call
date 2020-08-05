import { Module, Logger } from '@nestjs/common';
import { AuthGateway } from './auth.gateway';
import { AuthDataAccessModule } from '@chat-and-call/auth/data-access-auth-server';
import { ChannelsGateway } from './channels.gateway';
import { ChannelsDataAccessModule } from '@chat-and-call/channels/data-access-server';

@Module({
  imports: [AuthDataAccessModule, ChannelsDataAccessModule],
  providers: [AuthGateway, ChannelsGateway],
})
export class GatewaysModule {}
