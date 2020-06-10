import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { AGServerSocket } from 'socketcluster-server';

interface CrudRequest {
  method: string;
  body: any;
  path: string;
}

export interface SocketCrudRequest {
  id: number;
  procedure: string;
  data: CrudRequest;
  sent: boolean;
  socket: AGServerSocket;
  _respond: Function;
  end: Function;
  error: Function;
}

export function AsyngularInterceptor(method: string, path: string) {
  return (
    target: NestGateway,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const fn: Function = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const mappedValues: Array<any> = [];

      const request = args.find(
        (arg) => arg?.constructor?.name === 'AGRequest'
      ) as SocketCrudRequest;

      for (const arg of args) {
        const objType = arg?.constructor?.name;

        switch (objType) {
          case 'AGRequest':
            mappedValues.push(request?.data?.body ?? null);
            break;
          case 'AsyncStreamEmitter':
            const socket = request
              ? {
                  ...arg,
                  ok: request.end,
                  error: request.error,
                }
              : arg;
            // Recover prototype functions
            Object.setPrototypeOf(socket, Object.getPrototypeOf(arg));

            mappedValues.push(socket);
            break;
          default:
            mappedValues.push(arg);
        }
      }

      /* if (
        request?.data?.method === method  && request?.data?.path === path
      ) {
        mappedValues.push({ ok: request.end, error: request.error });
        return fn.apply(this, mappedValues);
      } */
      return fn.apply(this, mappedValues);
    };
    return descriptor;
  };
}
