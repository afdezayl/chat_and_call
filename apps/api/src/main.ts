import { SocketClusterAdapter } from '@chat-and-call/socketcluster/adapter';
import { GatewayExplorerModule } from '@chat-and-call/utils/feature-gateway-explorer';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

// TODO: Professional logger (Winston, ...);
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug']
  });
  const config = app.get(ConfigService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(cookieParser(config.get('COOKIE_SECRET')));
  app.useGlobalPipes(new ValidationPipe());

  // Socketcluster adapter module
  const wsAdapter = app.get(SocketClusterAdapter);
  app.useWebSocketAdapter(wsAdapter);

  const port = process.env.PORT || 3333;
  await app.listen(port);

  Logger.log(
    'Listening at http://localhost:' + port + '/' + globalPrefix,
    'bootstrap'
  );

  const gatewayExplorer = new GatewayExplorerModule(app);
}

bootstrap();
