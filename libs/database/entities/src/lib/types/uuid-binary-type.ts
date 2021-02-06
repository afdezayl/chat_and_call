import { Type } from '@mikro-orm/core';
import { parse, stringify, v1, validate } from 'uuid';

export class UuidBinaryType extends Type<string, Buffer> {
  convertToDatabaseValue(value: string | any): Buffer {
    return validate(value) ? Buffer.from(parse(value)) : value;
  }

  convertToJSValue(value: any): string {
    console.log('toJS value: ', value);
    if (Reflect.has(value, 'uuid')) {
      return Buffer.isBuffer(value.uuid) ? stringify(value.uuid) : value.uuid;
    }

    return stringify(value);
  }

  getColumnType(): string {
    return 'binary(16)';
  }

  static createUuuid() {
    return v1();
  }
}
