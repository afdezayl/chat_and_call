import { AuthState, initialState } from './auth.reducer';
import * as AuthSelectors from './auth.selectors';

describe('Auth Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  let state;
  beforeEach(() => {
    state = {
      auth: {
        authorized: true,
        error: null,
      },
    };
  });

  describe('Auth Selectors', () => {
    it('isLogged should return true', () => {
      const result = AuthSelectors.isLogged(state);
      expect(result).toBe(true);
    });
  });
});
