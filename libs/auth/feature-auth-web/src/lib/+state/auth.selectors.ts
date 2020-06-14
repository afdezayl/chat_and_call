import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  AUTH_FEATURE_KEY,
  AuthState,
} from './auth.reducer';
import { create } from 'domain';

export const getAuthState = createFeatureSelector<AuthState>(
  AUTH_FEATURE_KEY
);

export const isLogged = createSelector(
  getAuthState,
  (state: AuthState) => state.authorized
);

export const isValidAttempt =  createSelector(
  getAuthState,
  (state: AuthState) => state.validAttempt
);
