import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthDataAccessModule } from '@chat-and-call/auth/data-access-auth-server';

@Module({
  controllers: [AuthController],
  imports: [AuthDataAccessModule]
})
export class ControllersModule {}
