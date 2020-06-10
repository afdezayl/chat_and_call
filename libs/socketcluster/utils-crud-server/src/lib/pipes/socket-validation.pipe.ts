import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SocketCrudRequest } from '../utils/AsyngularInterceptor';

@Injectable()
export class SocketValidationPipe implements PipeTransform<any> {
  async transform(socket: SocketCrudRequest | any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    const value = socket?.data?.body || socket;

    if (!metatype || !this.toValidate(metatype)) {
      return socket;
    }

    const entity = plainToClass(metatype, value);
    const errors = await validate(entity);

    if (errors.length > 0) {
      return socket.error(JSON.stringify(errors));
    }

    return socket;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
