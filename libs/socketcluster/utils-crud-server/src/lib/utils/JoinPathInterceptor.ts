import {
  MESSAGE_MAPPING_METADATA, MESSAGE_METADATA
} from '@nestjs/websockets/constants';
import { SOCKET_PATHS_METADATA } from '../constants';

type pathType = NonNullable<'' | 'get' | 'post' | 'put' | 'patch' | 'delete'>;

export function JoinPathInterceptor(
  method: string,
  type?: pathType
): MethodDecorator {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const paths = Reflect.getMetadata(SOCKET_PATHS_METADATA, target) ?? [];

    paths.push((gateway = '') => {
      const fullPath = generatePath(gateway, method, type);

      Reflect.defineMetadata(MESSAGE_MAPPING_METADATA, true, descriptor.value);
      Reflect.defineMetadata(MESSAGE_METADATA, fullPath, descriptor.value);
    });

    Reflect.defineMetadata(SOCKET_PATHS_METADATA, paths, target);
    //return target;
  };
}

function generatePath(
  gateway: string,
  method: string,
  type?: pathType
): string {
  let typeSegment = '';
  if (type === '') {
    typeSegment = `#`;
  }
  if (type) {
    typeSegment = `#${type}:`;
  }

  const gatewaySegment = gateway ? `${gateway}/` : '';

  const methodSegment = `${method}`;

  return `${typeSegment}${gatewaySegment}${methodSegment}`;
}
