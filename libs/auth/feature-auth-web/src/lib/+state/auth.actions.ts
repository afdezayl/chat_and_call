import { createAction, props } from '@ngrx/store';
import { LoginRequestDto, SignupRequestDto } from '@chat-and-call/auth/shared';

// Login
export const sendLoginRequest = createAction(
  '[Auth] Login request',
  props<LoginRequestDto>()
);
export const loginSuccess = createAction(
  '[Auth] Login success',
  props<{ token: string }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);
export const logoutClick = createAction('[Auth] Logout request');
export const logoutConfirmed = createAction('[Auth] Logout');
export const logoutAborted = createAction('[Auth] Logout aborted');

// Signup
export const sendSignupRequest = createAction(
  '[Auth] Signup request',
  props<SignupRequestDto>()
);
export const signupSuccess = createAction('[Auth] Signup success');
export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ usernameFail: boolean; emailFail: boolean }>()
);
