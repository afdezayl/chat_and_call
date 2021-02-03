import { IsNotEmpty, IsAlphanumeric, Matches, Length } from 'class-validator';

export interface LoginRequest {
  username: string;
  password: string;
}

export class LoginRequestDto implements LoginRequest {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Matches(/[A-Z]/i)
  @Length(4, 20)
  username!: string;

  @Length(4, 20)
  password!: string;
}
