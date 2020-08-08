import {
  MESSAGE_METADATA,
  MESSAGE_MAPPING_METADATA,
} from '@nestjs/websockets/constants';
import { SOCKET_PATHS_METADATA } from '../constants';

type pathType = '' | 'get' | 'post' | 'put' | 'patch' | 'delete';

export function JoinPathInterceptor(method: string, type?: pathType) {
  return (target, key, descriptor) => {
    const paths = Reflect.getMetadata(SOCKET_PATHS_METADATA, target) ?? [];

    paths.push((gateway = '') => {
      const fullPath = generatePath(type, gateway, method);

      Reflect.defineMetadata(MESSAGE_MAPPING_METADATA, true, descriptor.value);
      Reflect.defineMetadata(MESSAGE_METADATA, fullPath, descriptor.value);
    });

    Reflect.defineMetadata(SOCKET_PATHS_METADATA, paths, target);
    return target;
  };
}

function generatePath(type: pathType, gateway: string, method: string): string {
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
