import { ChannelsDataAccessModule } from '@chat-and-call/channels/data-access-server';
import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities';

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
    MikroOrmModule.forFeature([User]),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthDataAccessModule {}
