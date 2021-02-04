import { AuthService } from '@chat-and-call/auth/data-access-auth-server';
import { LoginRequestDto, SignupRequestDto } from '@chat-and-call/auth/shared';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  Logger,
  NotImplementedException,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { of } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  @Get('refresh')
  refresh(@Req() request: Request, @Res() response: Response) {
    console.log(request.cookies, request.signedCookies);
    throw new NotImplementedException();
    //return response.send(request.signedCookies);
  }

  @Post('login')
  async login(@Body() data: LoginRequestDto, @Res() response: Response) {
    const isValid = await this.authService.validateUserCredentials(
      data.username,
      data.password
    );

    if (isValid) {
      const tokens = await this.authService.getTokens(data.username);

      // Set tokens as cookie
      response.cookie('jwt', tokens.jwt, { httpOnly: true, signed: true });
      response.cookie('refresh_jwt', tokens.refresh, {
        httpOnly: true,
        sameSite: 'strict',
        signed: true,
      });

      return response.status(200).send({ token: tokens.jwt });
    }

    return response.sendStatus(401);
  }

  @Post('signup')
  async signup(@Body() data: SignupRequestDto) {
    const isCreated = await this.authService.createNewUser(
      data.username,
      data.password,
      data.email
    );

    if (isCreated) {
      return;
    }

    throw new ConflictException();
  }

  @Get('username')
  async chechUsername(@Query('user') username: string) {
    const isUser = await this.authService.isUser(username);
    return of(!isUser);
  }
}
