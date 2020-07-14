import {
  Controller,
  Post,
  Body,
  Logger,
  Get,
  Res,
  Req,
  NotImplementedException,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginRequestDto, SignupRequestDto } from '@chat-and-call/auth/shared';
import { AuthService } from '@chat-and-call/auth/data-access-auth-server';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  @Get('refresh')
  refresh(@Req() request: Request, @Res() response: Response) {
    console.log(request.cookies);
    throw new NotImplementedException();
  }

  @Post('login')
  async login(@Body() data: LoginRequestDto, @Res() response: Response) {
    const isValid = await this.authService.validateUserCredentials(
      data.username,
      data.password
    );

    if (isValid) {
      const tokens = await this.authService.getTokens(data.username);

      // Set as cookie
      response.cookie('jwt', tokens.jwt, { httpOnly: true });
      response.cookie('refresh_jwt', tokens.refresh, {
        httpOnly: true,
        sameSite: 'strict',
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
      return true;
    }
    return false;
  }

  @Get('username')
  async chechUsername(@Query('user') username: string) {
    const isUser = await this.authService.isUser(username);
    console.log(isUser);
    return of(!isUser); //.pipe(delay(3000));
  }
}
