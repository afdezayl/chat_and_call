import { Type } from '@mikro-orm/core';
import { parse, stringify, v1, validate } from 'uuid';

export class UuidBinaryType extends Type<string, Buffer> {
  convertToDatabaseValue(value: string | any): Buffer {
    return validate(value) ? Buffer.from(parse(value)) : value;
  }

  convertToJSValue(value: Buffer): string {
    return stringify(value);
  }

  getColumnType(): string {
    return 'binary(16)';
  }

  static createUuuid() {
    return v1();
  }
}
