import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  authorized: boolean;
  isValidLoginAttempt: boolean;
  signupError: SignupError | null;
  createdUser: boolean;
}

export interface SignupError {
  email: boolean;
  username: boolean;
}

export const initialState: AuthState = {
  authorized: false,
  isValidLoginAttempt: true,
  signupError: null,
  createdUser: false,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    authorized: true,
    validAttempt: true,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    authorized: false,
    isValidLoginAttempt: false,
    error,
  })),
  on(AuthActions.signupSuccess, (state) => ({
    ...state,
    createdUser: true,
    signupError: null,
  })),
  on(AuthActions.signupFailure, (state, { usernameFail, emailFail }) => ({
    ...state,
    createdUser: false,
    signupError: { email: emailFail, username: usernameFail },
  }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
