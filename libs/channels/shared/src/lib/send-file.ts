import { IsNotEmpty } from 'class-validator';
import { Field, Message } from 'protobufjs';

export class FileDispatch {
  @IsNotEmpty()
  channel!: string;
  @IsNotEmpty()
  filename!: string;
  @IsNotEmpty()
  size!: number;
  @IsNotEmpty()
  checksum!: string;
}

export class FileAcceptedDTO extends Message<FileAcceptedDTO> {
  @Field.d(1, 'string', 'required')
  id!: string;
}

export class FileInfoDTO extends Message<FileInfoDTO> {
  @Field.d(1, 'string', 'required')
  id!: string;

  @Field.d(2, 'string', 'required')
  channel!: string;

  @Field.d(3, 'string', 'required')
  filename!: string;

  @Field.d(4, 'uint32', 'required')
  size!: number;

  @Field.d(5, 'string', 'required')
  from!: string;

  @Field.d(6, 'string', 'required')
  checksum!: string;
}

export class FileChunkDTO extends Message<FileChunkDTO> {
  @Field.d(1, 'string', 'required')
  id!: string;

  @Field.d(2, 'string', 'required')
  channel!: string;

  @Field.d(3, 'uint32', 'required')
  order!: number;

  @Field.d(4, 'bytes', 'required')
  chunk!: Uint8Array;
}

export class FileDispatchDTO
  extends Message<FileDispatchDTO>
  implements FileDispatch {
  @Field.d(1, 'string', 'required')
  channel!: string;

  @Field.d(2, 'string', 'required')
  filename!: string;

  @Field.d(3, 'uint32', 'required')
  size!: number;

  @Field.d(4, 'string', 'required')
  checksum!: string;
}
