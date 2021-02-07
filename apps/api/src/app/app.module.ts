import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ControllersModule } from './api/controllers/controllers.module';
import { DevTestsGateway } from './dev-tests.gateway';
import { GatewaysModule } from './gateways/gateways.module';
import { LoggerModule } from './logger/logger.module';
import { environment } from '../environments/environment';

@Module({
  providers: [DevTestsGateway],
  imports: [
    ConfigModule.forRoot(),
    ControllersModule,
    GatewaysModule,
    LoggerModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          autoLoadEntities: true,
          debug: !environment.production,
          type: 'mysql',
          dbName: config.get('DB_NAME'),
          password: config.get('DB_PASS'),
          user: config.get('DB_USER'),
          host: config.get('DB_HOST'),
        };
      },
    }),
  ],
  controllers: [],
})
export class AppModule {}
