import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@chat-and-call/database/entities';
import { AuthService } from './service';

@Module({
  controllers: [],
  imports: [
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
