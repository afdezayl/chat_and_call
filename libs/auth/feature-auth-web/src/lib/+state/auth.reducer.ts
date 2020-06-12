import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  authorized: boolean;
  error: string;
}

export const initialState: AuthState = {
  authorized: false,
  error: null,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state) => ({ ...state, authorized: true, error: null })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, authorized: false, error }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
