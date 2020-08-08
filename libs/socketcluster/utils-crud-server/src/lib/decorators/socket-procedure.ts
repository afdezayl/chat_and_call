import { applyDecorators, UseFilters, UsePipes } from '@nestjs/common';
import { SubscribeMessage } from '@nestjs/websockets';
import { SocketClusterExceptionFilter } from '../exceptions/ws-exception-filter';
import { SocketValidationPipe, SocketCrudValidationPipe } from '../pipes';
import { JoinPathInterceptor } from '../utils/JoinPathInterceptor';
import { SocketProcedureInterceptor } from '../utils/SocketclusterInterceptor';

export const SocketProcedure = (path: string) => {
  const newPath = `#${path}`;
  return applyDecorators(
    SocketProcedureInterceptor(),
    SubscribeMessage(newPath),
    JoinPathInterceptor(path, ''),
    UsePipes(SocketValidationPipe),
    UseFilters(SocketClusterExceptionFilter)
  );
};
