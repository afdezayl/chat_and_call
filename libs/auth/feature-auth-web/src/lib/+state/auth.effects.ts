import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_KEY } from '@chat-and-call/socketcluster/shared';
import { FullscreenLoadingService } from '@chat-and-call/utils/forms-shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService, NotAvailableUserOrEmail, Success } from '../auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  loginAttempt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendLoginRequest),
      mergeMap((request) =>
        this.loading
          .showLoading(this.authService.sendLoginRequest(request))
          .pipe(
            tap((token) => {
              localStorage.setItem(TOKEN_KEY, token);
            }),
            map((token) => AuthActions.loginSuccess({ token })),
            catchError((error) => {
              console.error(error);
              return of(AuthActions.loginFailure(error));
            })
          )
      )
    )
  );

  validLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((x) => this.router.navigate(['chat']))
      ),
    { dispatch: false }
  );

  signupAttempt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendSignupRequest),
      mergeMap((request) =>
        this.loading
          .showLoading(this.authService.sendSignupRequest(request))
          .pipe(
            map((res) => {
              if (res instanceof Success) {
                return AuthActions.signupSuccess();
              } else if (res instanceof NotAvailableUserOrEmail) {
                return AuthActions.signupFailure({
                  emailFail: res.emailTaken,
                  usernameFail: res.usernameTaken,
                });
              }
              throw new Error('Flow not implemented');
            })
            // TODO: errors...
            /* catchError((error: Error) => {
              console.log(error);
              const message = error.message;
              return of(AuthActions.signupFailure({ error: message }));
            }) */
          )
      )
    )
  );

  validSignup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupSuccess),
        // TODO: Replace with confirm modal
        tap(() => alert('Registrado correctamente')),
        tap(() => this.router.navigate(['home', 'login']))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private loading: FullscreenLoadingService,
    private router: Router
  ) {}
}
