import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChat from './chat.reducer';

export const selectChatState = createFeatureSelector<fromChat.ChatState>(
  fromChat.chatFeatureKey
);

export const getUsername = createSelector(
  selectChatState,
  (state) => state.user?.username
);

export const getChannels = createSelector(
  selectChatState,
  (state) => state.channels
);

export const getFocus = createSelector(selectChatState, (state) => state.focus);

export const getMessages = createSelector(
  selectChatState,
  (state) => state.messages
);

export const getFocusedChannel = createSelector(
  getFocus,
  getChannels,
  (focus, channels) => channels.find((ch) => ch.id === focus) ?? null
);

export const getMessagesFromFocusChannel = createSelector(
  getFocus,
  getMessages,
  (focus, messages) => messages.filter((m) => m?.channel === focus)
);
