import { Field, Message } from 'protobufjs';

export class Text extends Message<Text> {
  @Field.d(1, 'string', 'required')
  text!: string;
}
