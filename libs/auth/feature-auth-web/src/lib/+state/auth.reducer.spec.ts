import * as AuthActions from './auth.actions';
import { initialState, reducer, AuthState } from './auth.reducer';

describe('Auth Reducer', () => {
  beforeEach(() => {});

  describe('valid login', () => {
    it('loginSuccess should set authorized to true', () => {

      const action = AuthActions.loginSuccess();

      const result: AuthState = reducer(initialState, action);

      expect(result.authorized).toBe(true);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
