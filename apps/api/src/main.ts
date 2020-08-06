import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { GatewayExplorerModule } from '@chat-and-call/utils/feature-gateway-explorer';
import { SocketClusterAdapter } from '@chat-and-call/socketcluster/adapter';
import { TOKEN_KEY, SOCKET_PATH } from '@chat-and-call/socketcluster/shared'

import { AppModule } from './app/app.module';

// TODO: Professional logger (Winston, ...);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.useWebSocketAdapter(
    new SocketClusterAdapter(app, {
      path: SOCKET_PATH,
      authKey: config.get('JSON_WEBTOKEN_KEY'),
      socketChannelLimit: 1000,
      origins: '*:*',
<<<<<<< HEAD
      authDefaultExpiry: config.get('JWT_EXPIRES_MIN') * 60
=======
      authDefaultExpiry: config.get('JWT_EXPIRES_MIN') * 60,
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
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
