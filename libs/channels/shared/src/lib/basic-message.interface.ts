import { IsNotEmpty } from 'class-validator';
import { Field, Message } from 'protobufjs';
export class BasicMessage {
  @IsNotEmpty()
  channel!: string;

  @IsNotEmpty()
  text!: string;
}

export class SendMessageDTO extends Message<BasicMessage> {
  @Field.d(1, 'string', 'required')
  channel!: string;

  @Field.d(2, 'string', 'required')
  text!: string;
}
