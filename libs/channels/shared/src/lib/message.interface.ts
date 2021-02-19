import { Field, Message as ProtoMessage } from 'protobufjs';

export interface Message {
  id: string;
  channel: string;
  from: string;
  text?: string;
  date: string;
}

export class BasicMessageDto extends ProtoMessage<BasicMessageDto> {
  @Field.d(1, 'string', 'required')
  channel!: string;

  @Field.d(2, 'string', 'optional')
  text?: string;
}

export class MessageDTO extends ProtoMessage<MessageDTO> implements Message {
  @Field.d(1, 'string', 'required')
  id!: string;

  @Field.d(2, 'string', 'required')
  channel!: string;

  @Field.d(3, 'string', 'required')
  from!: string;

  @Field.d(4, 'string', 'optional')
  text?: string | undefined;

  @Field.d(5, 'string', 'required')
  date!: string;
}
