import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  authorized: boolean;
  isValidLoginAttempt: boolean;
  error: string;
  usernameSearch: UserSearch;
  createdUser: boolean;
}

export interface UserSearch {
  user: string;
  isAvailable: boolean;
}

export const initialState: AuthState = {
  authorized: false,
  isValidLoginAttempt: true,
  error: null,
  usernameSearch: {
    user: null,
    isAvailable: false,
  },
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
  on(AuthActions.setUsernameAvailability, (state, { user, isAvailable }) => ({
    ...state,
    usernameSearch: {
      user,
      isAvailable,
    },
  })),
  on(AuthActions.signupSuccess, (state) => ({
    ...state,
    createdUser: true,
  })),
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    createdUser: false,
  }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
