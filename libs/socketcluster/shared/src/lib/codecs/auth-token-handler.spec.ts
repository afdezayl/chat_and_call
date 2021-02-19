import { SCEvent, SCSetAuthToken } from '../dto';
import { authTokenHandler } from './auth-token-handler';

const validInput = {
  event: '#setAuthToken',
  data: {
    token: 'abc.abcd.abc',
  },
};
const error = {
  event: '#setAuthToken',
  data: {
    fail: 'abc.abcd.abc',
  },
};
test('should be encoded', () => {
  const encoded = SCSetAuthToken.encode(validInput).finish();
  const result = authTokenHandler.encode(validInput);

  expect(encoded).toStrictEqual(result);
});

test('scevent decode', () => {
  const encoded = authTokenHandler.encode(validInput);
  const result = SCEvent.decode(encoded);

  expect(result.event).toBe(validInput.event);
});

test('must match token', () => {
  const encoded = SCSetAuthToken.encode(validInput).finish();
  const result = authTokenHandler.decode(encoded);

  const encoded2 = authTokenHandler.encode(validInput);
  const result2 = authTokenHandler.decode(encoded2);

  expect(result.data.token).toBe(result2.data.token);
});

test('should fail', () => {
  expect(() => SCSetAuthToken.encode(error).finish()).toThrow();
  expect(() => authTokenHandler.encode(error)).toThrow();
});
