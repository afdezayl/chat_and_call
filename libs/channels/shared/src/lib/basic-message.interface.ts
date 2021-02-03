import {IsNotEmpty}from 'class-validator'
export class BasicMessage {
  @IsNotEmpty()
  channel!: string;

  @IsNotEmpty()
  text!: string;
}
