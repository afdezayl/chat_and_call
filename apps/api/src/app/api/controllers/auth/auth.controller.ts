import {
  AuthService,
  Fail,
  Success,
} from '@chat-and-call/auth/data-access-auth-server';
import {
  LoginRequestDto,
  SignupConflictResponseDto,
  SignupRequestDto,
} from '@chat-and-call/auth/shared';
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
import { WsException } from '@nestjs/websockets';
import { Request, Response } from 'express';

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
    const result = await this.authService.createNewUser(
      data.username,
      data.password,
      data.email
    );

    if (result instanceof Success) {
      return;
    } else if (result instanceof Fail) {
      throw new WsException('internal error');
    } else {
      const error: SignupConflictResponseDto = {
        notAvailableEmail: result.isEmailTaken,
        notAvailableUsername: result.isUsernameTaken,
      };
      throw new ConflictException(error);
    }
  }

  @Get('username')
  async checkUsername(@Query('user') username: string) {
    const isUser = await this.authService.isUsernameTaken(username);
    return !isUser;
  }

  @Get('email')
  async checkEmail(@Query('email') email: string) {
    const isEmail = await this.authService.isEmailTaken(email);
    return !isEmail;
  }
}
