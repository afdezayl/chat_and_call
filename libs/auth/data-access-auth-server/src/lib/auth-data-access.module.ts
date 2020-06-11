import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthRepositoryService } from './auth-repository/auth-repository.service';
import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';

@Module({
  controllers: [],
  imports: [DatabasePoolModule],
  providers: [AuthService, AuthRepositoryService],
  exports: [AuthService],
})
export class AuthDataAccessModule {}
