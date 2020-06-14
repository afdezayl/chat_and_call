import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { GatewayExplorerModule } from '@chat-and-call/utils/feature-gateway-explorer';
import { SocketClusterAdapter } from '@chat-and-call/socketcluster/adapter';

import { AppModule } from './app/app.module';

// TODO: Professional logger (Winston, ...);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser());
  app.useWebSocketAdapter(
    new SocketClusterAdapter(app, {
      path: '/socket',
      authKey: config.get('JSON_WEBTOKEN_KEY'),
      socketChannelLimit: 1000,
      origins: '*:*',
      authDefaultExpiry: 3600,
    })
  );

  const port = process.env.PORT || 3333;
  await app.listen(port);

  Logger.log(
    'Listening at http://localhost:' + port + '/' + globalPrefix,
    'bootstrap'
  );

  const gatewayExplorer = new GatewayExplorerModule(app);
}

bootstrap();
