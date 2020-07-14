import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { TOKEN_KEY } from '@chat-and-call/socketcluster/shared';

import * as AuthActions from './auth.actions';
import { AuthService } from '../auth.service';
import {
  map,
  exhaustMap,
  concatMap,
  mergeMap,
  catchError,
  tap,
  distinctUntilChanged,
  distinct,
} from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  loginAttempt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendLoginRequest),
      mergeMap((request) =>
        this.authService.sendLoginRequest(request).pipe(
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
        this.authService.sendSignupRequest(request).pipe(
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
          tap(console.log),
          map((isValid) =>
            AuthActions.setUsernameAvailability({ user, isAvailable: isValid })
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
