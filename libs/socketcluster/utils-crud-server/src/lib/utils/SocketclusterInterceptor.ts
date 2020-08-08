import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';

export function SocketProcedureInterceptor() {
  return (
    target: NestGateway,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const fn: Function = descriptor.value;
    descriptor.value = function (...args) {
      const mappedValues: Array<any> = [];

      for (const arg of args) {
        const objType = arg?.constructor?.name;

        if (objType === 'AGRequest') {
          mappedValues.push(arg?.data ?? null);
        } else {
          mappedValues.push(arg);
        }
      }

      return fn.apply(this, mappedValues);
    };

    return descriptor;
  };
}
