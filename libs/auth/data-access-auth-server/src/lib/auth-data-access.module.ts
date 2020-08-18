import { ChannelsDataAccessModule } from '@chat-and-call/channels/data-access-server';
import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthRepositoryService } from './auth-repository/auth-repository.service';
import { AuthService } from './auth/auth.service';

@Module({
  controllers: [],
  imports: [
    ChannelsDataAccessModule,
    DatabasePoolModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JSON_WEBTOKEN_KEY'),
        signOptions: {
          expiresIn: `${config.get('JWT_EXPIRES_MIN')}min`,
        },
      }),
    }),
  ],
  providers: [AuthService, AuthRepositoryService],
  exports: [AuthService],
})
export class AuthDataAccessModule {}
