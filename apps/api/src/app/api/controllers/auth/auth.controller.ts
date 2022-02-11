import {
  AuthService,
  Fail,
  Success
} from '@chat-and-call/auth/data-access-auth-server';
import {
  LoginRequestDto,
  SignupConflictResponseDto,
  SignupRequestDto
} from '@chat-and-call/auth/shared';
import {
  Body,
  ConflictException,
  ConsoleLogger,
  Controller,
  Get,
  InternalServerErrorException, Post,
  Query,
  Req,
  Res
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private logger: ConsoleLogger) {
    this.logger.setContext(this.constructor.name);
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

      // TODO: Token is not needed

      return response.status(200).send({ token: tokens.jwt });
    }

    return response.sendStatus(401);
  }

  @Post('logout')
  logout(@Res() response: Response) {
    response.clearCookie('jwt');
    response.clearCookie('refresh_jwt');

    return response.status(201).send(null);
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
      throw new InternalServerErrorException();
    } else {
      const error: SignupConflictResponseDto = {
        notAvailableEmail: result.isEmailTaken,
        notAvailableUsername: result.isUsernameTaken,
      };
      throw new ConflictException(error);
    }
  }

  @Get('authorized')
  async isAuthorized(@Req() request: Request) {
    const refreshCookie = request.signedCookies.refresh_jwt;
    const content = await this.authService.validateToken(refreshCookie);

    return !!content;
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
