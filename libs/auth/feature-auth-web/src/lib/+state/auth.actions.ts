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

// Signup
export const sendSignupRequest = createAction(
  '[Auth] Signup request',
  props<SignupRequestDto>()
);
export const signupSuccess = createAction('[Auth] Signup success');
export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: string }>()
);
export const getUsernameAvailability = createAction(
  '[Auth] Check username',
  props<{ user: string }>()
);
export const setUsernameAvailability = createAction(
  '[Auth] Available username',
  props<{ user: string; isAvailable: boolean }>()
);
