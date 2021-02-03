import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_KEY } from '@chat-and-call/socketcluster/shared';
import { FullscreenLoadingService } from '@chat-and-call/utils/forms-shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
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
            map(
              (isCreated) =>
                isCreated
                  ? AuthActions.signupSuccess()
                  : AuthActions.signupFailure({ error: 'ff' }) // TODO: errors...
            ),
            catchError((error) => of(AuthActions.signupFailure({ error })))
          )
      )
    )
  );

  usernameCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getUsernameAvailability),
      mergeMap(({ user }) =>
        this.authService.isUsernameAvailable(user).pipe(
          map((isValid) =>
            AuthActions.setUsernameAvailability({
              user,
              isAvailable: isValid,
            })
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private loading: FullscreenLoadingService,
    private router: Router
  ) {}
}
