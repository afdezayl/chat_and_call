import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';

export function SocketProcedureInterceptor<T>(): MethodDecorator {
  return (
    _target: NestGateway,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const fn: Function = descriptor.value;
    descriptor.value = function (...args: any) {
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

    //return descriptor;
  };
}
