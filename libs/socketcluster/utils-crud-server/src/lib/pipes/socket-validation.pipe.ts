import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketValidationPipe implements PipeTransform<any> {
  async transform(request: any | any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    const value = request?.data?.body ?? request;

    // Only 'body', 'param' and 'header' metadata types
    if (!metatype || !this.toValidate(metatype) || metadata.type === 'custom') {
      return request;
    }

    const entity = plainToClass(metatype, value);
    const errors = await validate(entity);

    if (errors.length > 0) {
      throw new WsException(errors);
    }

    return request;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
