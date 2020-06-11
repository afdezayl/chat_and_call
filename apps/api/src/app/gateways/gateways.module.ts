import { Module, Logger } from '@nestjs/common';
import { AuthGateway } from './auth.gateway';
import { AuthDataAccessModule } from '@chat-and-call/auth/data-access-auth-server';

@Module({
  imports: [AuthDataAccessModule],
  providers: [AuthGateway],
})
export class GatewaysModule {}
