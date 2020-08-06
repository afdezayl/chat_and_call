import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChat from './chat.reducer';

export const selectChatState = createFeatureSelector<fromChat.ChatState>(
  fromChat.chatFeatureKey
);

export const getChannels = createSelector(
  selectChatState,
  (state) => state.channels
)

export const getFocus = createSelector(
  selectChatState,
  (state) => state.focus
)

export const getMessages = createSelector(
  selectChatState,
  (state) => state.messages
)

export const getFocusedChannel = createSelector(
  getFocus,
  getChannels,
  (focus, channels) => channels.find(ch => ch.id === focus) ?? null
)

export const getMessagesFromFocusChannel = createSelector(
  getFocus,
  getMessages,
<<<<<<< HEAD
  (focus, messages) => messages.filter(m => m?.channel === focus)
=======
  (focus, messages) => messages.filter(m => m.channel === focus)
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
)


