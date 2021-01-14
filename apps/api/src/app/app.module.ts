import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ControllersModule } from './api/controllers/controllers.module';
import { DevTestsGateway } from './dev-tests.gateway';
import { GatewaysModule } from './gateways/gateways.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  providers: [DevTestsGateway],
  imports: [
    ConfigModule.forRoot(),
    ControllersModule,
    DatabasePoolModule,
    GatewaysModule,
    LoggerModule,
  ],
  controllers: [],
})
export class AppModule {}
