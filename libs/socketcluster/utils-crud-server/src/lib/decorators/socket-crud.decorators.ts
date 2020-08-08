import { applyDecorators, UseFilters, UsePipes } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { SOCKET_PATHS_METADATA } from '../constants';
import { SocketClusterExceptionFilter } from '../exceptions';
import { SocketCrudValidationPipe } from '../pipes';
import { JoinPathInterceptor, SocketCrudInterceptor } from '../utils';

function executeGatewayFunctions(path: string) {
  return (target: any) => {
    const functions: Array<Function> =
      Reflect.getMetadata(SOCKET_PATHS_METADATA, target.prototype) ?? [];
    functions.forEach((fn) => fn(path));
    return target;
  };
}

export const SocketGet = (path: string) => {
  return applyDecorators(
    SocketCrudInterceptor('GET', path),
    SubscribeMessage(`#get:${path}`),
    JoinPathInterceptor(path, 'get'),
    UsePipes(SocketCrudValidationPipe),
    UseFilters(SocketClusterExceptionFilter)
  );
};

export const SocketPost = (path: string) => {
  return applyDecorators(
    SocketCrudInterceptor('POST', path),
    SubscribeMessage(`#post:${path}`),
    JoinPathInterceptor(path, 'post'),
    UsePipes(SocketCrudValidationPipe),
    UseFilters(SocketClusterExceptionFilter)
  );
};

export const SocketPut = (path: string) => {
  return applyDecorators(
    SocketCrudInterceptor('PUT', path),
    SubscribeMessage(`#put:${path}`),
    JoinPathInterceptor(path, 'put'),
    UsePipes(SocketCrudValidationPipe),
    UseFilters(SocketClusterExceptionFilter)
  );
};

export const SocketDelete = (path: string) => {
  return applyDecorators(
    SocketCrudInterceptor('DELETE', path),
    SubscribeMessage(`#delete:${path}`),
    JoinPathInterceptor(path, 'delete'),
    UsePipes(SocketCrudValidationPipe),
    UseFilters(SocketClusterExceptionFilter)
  );
};

export const SocketCrudGateway = (path = ''): ClassDecorator => {
  return applyDecorators(WebSocketGateway(), executeGatewayFunctions(path));
};
