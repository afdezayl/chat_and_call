import { Field, Message } from 'protobufjs';
export class FileChunk extends Message<FileChunk> {
  @Field.d(1, 'sint32', 'required')
  order!: number;

  @Field.d(2, 'bytes', 'required')
  data!: Uint8Array;
}
