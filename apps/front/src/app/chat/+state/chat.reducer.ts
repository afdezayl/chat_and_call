import { Action, createReducer, on } from '@ngrx/store';
import { Channel, Message } from '@chat-and-call/channels/shared';
import * as ChatActions from './chat.actions';

export const chatFeatureKey = 'chat';

export interface User {
  username: string;
}

export interface Contact {
  username: string;
  status: string;
}

export interface ChatState {
  user: User | null;
  contacts: Array<Contact>;
  channels: Array<Channel>;
  messages: Array<Message>;
  focus: string | number | null;
}

export const initialState: ChatState = {
  user: null,
  contacts: [],
  channels: [],
  messages: [],
  focus: null,
};

export const reducer = createReducer(
  initialState,

  on(ChatActions.userAuthenticated, (state, { username }) => ({
    ...state,
    user: { ...state.user, username },
  })),
  on(ChatActions.addChannels, (state, { channels }) => ({
    ...state,
    channels: [
      ...state.channels,
      ...channels.filter((ch) => !state.channels.some((c) => c.id === ch.id)),
    ],
  })),

  on(ChatActions.removeChannels, (state, { channels }) => ({
    ...state,
    channels: state.channels.filter(
      (ch) => !channels.some((c) => c.id === ch.id)
    ),
  })),

  on(ChatActions.setFocus, (state, { id }) => ({
    ...state,
    focus: id,
  })),

  on(ChatActions.incomingMessage, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
  }))
);
