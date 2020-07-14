import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthRepositoryService } from './auth-repository/auth-repository.service';
import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';
import { JwtModule } from '@nestjs/jwt';
import { async } from 'rxjs/internal/scheduler/async';

@Module({
  controllers: [],
  imports: [
    DatabasePoolModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject:[ ConfigService],
      useFactory: async(config: ConfigService) => ({
        secret: config.get('JSON_WEBTOKEN_KEY'),
        signOptions: {
          expiresIn: `${config.get('JWT_EXPIRES_MIN')}min`
        }
      })
    }),
  ],
  providers: [AuthService, AuthRepositoryService],
  exports: [AuthService],
})
export class AuthDataAccessModule {}
