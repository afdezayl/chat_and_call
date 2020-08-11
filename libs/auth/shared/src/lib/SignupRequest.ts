import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export class SignupRequestDto implements SignupRequest {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(45)
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Matches(/[A-Z]/i)
  @Length(4, 20)
  username: string;

  @Length(4, 20)
  password: string;
}
