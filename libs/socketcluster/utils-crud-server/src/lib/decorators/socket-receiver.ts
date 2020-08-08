import { applyDecorators, UseFilters, UsePipes } from '@nestjs/common';
import { SubscribeMessage } from '@nestjs/websockets';
import { SocketClusterExceptionFilter } from '../exceptions/ws-exception-filter';
import { SocketValidationPipe } from '../pipes';
import { JoinPathInterceptor } from '../utils/JoinPathInterceptor';

export const SocketReceiver = (path: string) => {
  if (path.startsWith('#')) {
    throw new Error(
      'Invalid path for receiver. Can´t start with "#", reserved for procedures.'
    );
  }
  return applyDecorators(
    SubscribeMessage(path),
    JoinPathInterceptor(path),
    UsePipes(SocketValidationPipe),
    UseFilters(SocketClusterExceptionFilter)
  );
};
