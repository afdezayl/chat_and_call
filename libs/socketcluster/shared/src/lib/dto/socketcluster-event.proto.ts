import { Field, Message } from 'protobufjs';
import { StrictAny } from './any.proto';

export class SCEvent extends Message<SCEvent> {
  @Field.d(1, 'string', 'required')
  event!: string;

  @Field.d(2, StrictAny, 'optional')
  data?: StrictAny;

  @Field.d(3, 'uint32', 'optional')
  cid?: number;
}

export class SCEventResponse extends Message<SCEventResponse> {
  @Field.d(1, 'uint32', 'required')
  rid!: number;

  @Field.d(2, StrictAny, 'optional')
  data?: StrictAny;
}
