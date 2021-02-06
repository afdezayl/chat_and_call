import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateChannelRequest {
  @IsNotEmpty()
  @MaxLength(35)
  title!: string;
}
