import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevTestsGateway } from './dev-tests.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DevTestsGateway],
})
export class AppModule {}
