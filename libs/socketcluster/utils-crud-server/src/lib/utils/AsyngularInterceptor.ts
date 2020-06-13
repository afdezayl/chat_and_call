import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';

// TODO: Change to filter, throw exception?
export function AsyngularInterceptor(method: string, path: string) {
  return (
    target: NestGateway,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const fn: Function = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const mappedValues: Array<any> = [];

      for (const arg of args) {
        const objType = arg?.constructor?.name;

        if (objType === 'AGRequest') {
          mappedValues.push(arg?.data?.body ?? null);
        } else {
          mappedValues.push(arg);
        }
      }

      return fn.apply(this, mappedValues);
    };
    return descriptor;
  };
}
