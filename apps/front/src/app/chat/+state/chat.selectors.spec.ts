import * as fromChat from './chat.reducer';
import { selectChatState } from './chat.selectors';

describe('Chat Selectors', () => {
  it('should select the feature state', () => {
    const result = selectChatState({
      [fromChat.chatFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
