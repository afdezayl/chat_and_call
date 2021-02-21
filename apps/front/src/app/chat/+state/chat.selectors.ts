import { visibleChannelsTypes } from '@chat-and-call/channels/shared';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChat from './chat.reducer';

export const selectChatState = createFeatureSelector<fromChat.ChatState>(
  fromChat.chatFeatureKey
);

export const getUsername = createSelector(
  selectChatState,
  (state) => state.user?.username ?? ''
);

export const getChannels = createSelector(selectChatState, (state) =>
  state.channels.filter((ch) => visibleChannelsTypes.includes(ch.type))
);

export const getFocus = createSelector(selectChatState, (state) => state.focus);

export const getMessages = createSelector(
  selectChatState,
  (state) => state.messages
);

export const isSelfMessage = createSelector(
  getMessages,
  getUsername,
  (
    messages: Array<fromChat.ChatMessage>,
    user: string,
    props: { id: string }
  ) => messages.some((m) => m.id === props.id && m.from === user)
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
