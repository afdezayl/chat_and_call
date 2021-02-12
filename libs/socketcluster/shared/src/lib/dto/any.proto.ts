import { Field, Message } from 'protobufjs';

export class StrictAny extends Message<StrictAny> {
  @Field.d(1, 'string', 'required')
  type_url!: string;

  @Field.d(2, 'bytes', 'required')
  value!: Uint8Array;
}
