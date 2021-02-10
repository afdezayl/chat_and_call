import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGroupChannelRequest {
  @IsNotEmpty()
  @MaxLength(35)
  title!: string;
}
