import { ErrorTranslation } from '@chat-and-call/utils/forms-shared';
export const loginErrors: Record<string, Array<ErrorTranslation>> = {
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
  ],
  password: [
    {
      error: 'minlength',
      literal: 'minMaxLength',
      params: { min: '4', max: '20' },
    },
    {
      error: 'required',
      literal: 'requiredField',
    },
  ],
};
