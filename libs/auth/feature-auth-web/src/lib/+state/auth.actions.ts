import { createAction, props } from '@ngrx/store';
import { LoginRequestDto } from '@chat-and-call/auth/shared-auth-interfaces';

export const sendLoginRequest = createAction(
  '[Auth] Login request',
  props<{ request: LoginRequestDto }>()
);

export const loginSuccess = createAction(
  '[Auth] Load Auth Success'
);

export const loginFailure = createAction(
  '[Auth] Load Auth Failure',
  props<{ error: string }>()
);
