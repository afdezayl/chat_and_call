import {
  Action,
  ActionReducer,
  createReducer,
  INIT,
  on,
  State,
} from '@ngrx/store';
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

export enum MessageStatus {
  Pending,
  Server,
  Target,
  Read,
  Error,
}
export interface ChatMessage extends Message {
  status: MessageStatus;
}

export interface ChatState {
  user: User | null;
  contacts: Array<Contact>;
  channels: Array<Channel>;
  messages: Array<ChatMessage>;
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

  on(ChatActions.sendMessageToserver, (state, { message, pendingId }) => ({
    ...state,
    messages: [
      ...state.messages,
      {
        id: pendingId,
        channel: message.channel,
        from: state.user?.username ?? '',
        text: message.text,
        date: new Date(),
        status: MessageStatus.Pending,
      },
    ],
  })),
  on(ChatActions.serverReceivedMessage, (state, { id, pendingId }) => ({
    ...state,
    messages: [
      ...state.messages.map<ChatMessage>((m) =>
        m.id === pendingId ? { ...m, id, status: MessageStatus.Server } : m
      ),
    ],
  })),
  on(ChatActions.incomingMessage, (state, { message }) => {
    if (message.from === state.user?.username) {
      return state;
    }
    return {
      ...state,
      messages: [
        ...state.messages,
        { ...message, status: MessageStatus.Server },
      ],
    };
  })
);

export function chatMetaReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return (state: State<any>, action: Action) => {
    if (action.type === ChatActions.cleanChatStore.type) {
      return reducer(undefined, { type: INIT });
    }
    return reducer(state, action);
  };
}
