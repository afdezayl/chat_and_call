import { Field, Message } from 'protobufjs';
import { StrictAny } from './any.proto';

export class SCEvent extends Message<SCEvent> {
  @Field.d(1, 'string', 'required')
  event!: string;

  /* @Field.d(2, StrictAny, 'optional')
  data?: StrictAny;

  @Field.d(3, 'uint32', 'optional')
  cid?: number; */
}

export class SCInvoke extends Message<SCInvoke> {
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

export class SCPublishData extends Message<SCPublishData> {
  @Field.d(1, 'string', 'required')
  channel!: string;

  @Field.d(2, StrictAny, 'required')
  data!: StrictAny;
}

export class SCPublishEvent extends Message<SCPublishEvent> {
  @Field.d(1, 'string', 'required')
  event!: '#publish';

  @Field.d(2, SCPublishData, 'required')
  data!: SCPublishData;
}

export class SCAuthToken extends Message<SCAuthToken> {
  @Field.d(1, 'string', 'required')
  token!: string;
}
export class SCSetAuthToken extends Message<SCSetAuthToken> {
  @Field.d(1, 'string', 'required')
  event!: '#setAuthToken';

  @Field.d(2, SCAuthToken, 'required')
  data!: SCAuthToken;
}

export class SCHandshakeToken extends Message<SCAuthToken> {
  @Field.d(1, 'string', 'required')
  token!: string;
}
export class SCHandshake extends Message<SCHandshake> {
  @Field.d(1, 'string', 'required')
  event!: '#setAuthToken';

  @Field.d(2, SCHandshakeToken, 'required')
  data!: SCHandshakeToken;

  @Field.d(3, 'uint32', 'required')
  cid?: number;
}
