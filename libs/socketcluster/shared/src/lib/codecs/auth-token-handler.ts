import { SCCodecEventHandler } from './codec-handle.interface';
import { SCSetAuthToken } from '../dto';

export const authTokenHandler: SCCodecEventHandler = {
  event: '#setAuthToken',
  encode: (object: SetAuthTokenContent) => {
    const verifyErrors = SCSetAuthToken.verify(object);

    if (verifyErrors) {
      throw new Error(verifyErrors);
    }

    return SCSetAuthToken.encode(object).finish();
  },
  decode: (buffer: Uint8Array) => {
    return SCSetAuthToken.decode(buffer);
  },
};

export interface SetAuthTokenContent {
  event: '#setAuthToken';
  data: {
    token: string;
  };
}
