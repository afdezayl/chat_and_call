import { applyDecorators, UsePipes } from '@nestjs/common';
import { SOCKET_PATHS_METADATA } from '../constants';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
  MESSAGE_METADATA,
  MESSAGE_MAPPING_METADATA,
} from '@nestjs/websockets/constants';
import { AsyngularInterceptor } from '../utils/AsyngularInterceptor';
import { SocketValidationPipe } from '../pipes/socket-validation.pipe';

function joinPath(type: string, method: string) {
  return (target, key, descriptor) => {
    const paths = Reflect.getMetadata(SOCKET_PATHS_METADATA, target) ?? [];

    paths.push((namespace = '') => {
      const fullPath = `#${type}:${namespace}/${method}`;
      Reflect.defineMetadata(MESSAGE_MAPPING_METADATA, true, descriptor.value);
      Reflect.defineMetadata(MESSAGE_METADATA, fullPath, descriptor.value);
    });

    Reflect.defineMetadata(SOCKET_PATHS_METADATA, paths, target);
    return target;
  };
}

function executeGatewayFunctions(path: string) {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const functions: Array<Function> = Reflect.getMetadata(
      SOCKET_PATHS_METADATA,
      target.prototype,
    )?? [];
    functions.forEach(fn => fn(path));
    return target;
  };
}

// Order matters:
// 1. Interceptor always first pipe
export const SocketGet = (path: string) => {
  return applyDecorators(
    AsyngularInterceptor('GET', path),
    SubscribeMessage(`#get:${path}`),
    joinPath('get', path),
    UsePipes(SocketValidationPipe),
  );
};

export const SocketPost = (path: string) => {
  return applyDecorators(
    AsyngularInterceptor('POST', path),
    SubscribeMessage(`#post:${path}`),
    joinPath('post', path),
    UsePipes(SocketValidationPipe),
  );
};

export const SocketPut = (path: string) => {
  return applyDecorators(
    AsyngularInterceptor('PUT', path),
    SubscribeMessage(`#put:${path}`),
    joinPath('put', path),
    UsePipes(SocketValidationPipe),
  );
};

export const SocketDelete = (path: string) => {
  return applyDecorators(
    AsyngularInterceptor('DELETE', path),
    SubscribeMessage(`#delete:${path}`),
    SubscribeMessage(`#delete:${path}`),
    UsePipes(SocketValidationPipe),
  );
};

export const SocketCrudGateway = (path = ''): ClassDecorator => {
  return applyDecorators(
    WebSocketGateway(),
    executeGatewayFunctions(path)
  );
};
