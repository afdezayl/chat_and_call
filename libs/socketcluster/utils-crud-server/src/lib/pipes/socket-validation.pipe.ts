import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class SocketValidationPipe implements PipeTransform<any> {
  async transform(request: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    const value = request?.data ?? request;

    if (this.omitValidation(metadata)) {
      return request;
    }

    const entity = plainToClass(metatype!, value);
    const errors = await validate(entity);

    if (errors.length > 0) {
      throw new WsException(errors);
    }

    return request;
  }

  // Only 'body', 'param' and 'header' metadata types
  private omitValidation(metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    return (
      !metatype || !this.toValidate(metatype) || metadata.type === 'custom'
    );
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
