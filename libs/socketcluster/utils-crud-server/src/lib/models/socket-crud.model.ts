import {IsOptional, IsNotEmptyObject, IsNotEmpty} from 'class-validator'

export class SocketCrudModel {
  @IsOptional()
  headers?: Map<string, string>;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  path: string;

  @IsOptional()
  @IsNotEmptyObject()
  body?: any;
}
