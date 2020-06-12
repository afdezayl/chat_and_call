import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as AuthActions from './auth.actions';
import { AuthService } from '../auth.service';
import {
  map,
  exhaustMap,
  concatMap,
  mergeMap,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  loadAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendLoginRequest),
      map((action) => action.request),
      mergeMap((request) =>
        this.authService.sendLoginRequest(request).pipe(
          map((isValid) =>
            isValid
              ? AuthActions.loginSuccess()
              : AuthActions.loginFailure({ error: 'Unauthorized' })
          ),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}

/* (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          this.authService.sendLoginRequest(action.request).pipe(

          )
          return action.request.password === '1234' ? AuthActions.loginSuccess() : AuthActions.loginFailure({error: 'Unauthorized'});
        },

        onError: (action, error) => {
          console.error('Error', error);
          return AuthActions.loginFailure({ error });
        }, */
