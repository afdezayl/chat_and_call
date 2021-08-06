import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'http://localhost:3334/api/oidc',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'foo',
        autoUserInfo: false,
        scope: 'openid', // 'openid profile ' + your scopes
        responseType: 'code',
        silentRenew: true,
        silentRenewUrl: window.location.origin + '/silent-renew.html',
        renewTimeBeforeTokenExpiresInSeconds: 10,
        logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
      },
    }),
  ],
  exports: [AuthModule],
  declarations: [UnauthorizedComponent],
})
export class AuthConfigModule {}
