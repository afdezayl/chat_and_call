import { IncomingMessage } from 'http';
import * as cookieUtility from 'cookie';
import * as cookieParser from 'cookie-parser';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieUtil {
  constructor(private config: ConfigService) {}

  getRefreshTokenFromRequest(request: IncomingMessage) {
    const cookies = this.getSignedCookiesFromRequest(request);
    return cookies.refresh_jwt || null;
  }

  getSignedCookiesFromRequest(request: IncomingMessage) {
    // Cookie parser middleware not applied, socketcluster intercepts handshake request
    const rawCookies = request?.headers?.cookie ?? '';
    const cookies = cookieUtility.parse(rawCookies);
    const signedCookies = cookieParser.signedCookies(
      cookies,
      this.config.get('COOKIE_SECRET')!
    );

    return signedCookies;
  }
}
