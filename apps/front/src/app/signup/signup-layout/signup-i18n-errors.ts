import { ErrorTranslation } from '@chat-and-call/utils/forms-shared';

export const signupErrors: Record<string, Array<ErrorTranslation>> = {
  username: [
    {
      error: 'minlength',
      literal: 'minMaxLength',
      params: { min: '4', max: '20' },
    },
    {
      error: 'required',
      literal: 'requiredField',
    },
    {
      error: 'pattern',
      literal: 'signup.usernamePattern',
    },
    {
      error: 'unavailable',
      literal: 'unavailableUsername',
      scope: 'signup',
    },
  ],
  email: [
    {
      error: 'required',
      literal: 'requiredField',
    },
    {
      error: 'email',
      literal: 'invalidEmail',
      scope: 'signup',
    },
    {
      error: 'unavailable',
      literal: 'unavailableEmail',
      scope: 'signup',
    },
  ],
  password: [
    {
      error: 'required',
      literal: 'requiredField',
    },
    {
      error: 'minlength',
      literal: 'minMaxLength',
      params: { min: '4', max: '20' },
    },
  ],
  password2: [
    {
      error: 'required',
      literal: 'requiredField',
    },
    {
      error: 'mustMatch',
      literal: 'notMatchingPasswords',
      scope: 'signup',
    },
  ],
};
