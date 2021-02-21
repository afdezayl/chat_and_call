import { Channel } from '@chat-and-call/channels/shared';
import {
  Action,
  ActionReducer,
  createReducer,
  INIT,
  on,
  State,
} from '@ngrx/store';
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

export interface ChatFileMessage {
  name: string;
  size: number;
  downloaded: number;
  done: boolean;
  blob?: Blob;
}
export interface ChatMessage {
  id: string;
  channel: string;
  from: string;
  date: string;
  status: MessageStatus;
  text?: string;
  file?: ChatFileMessage;
}

export interface Chunk {
  order: number;
  data: Uint8Array;
}
export interface FileUpload {
  to: string;
  id: string;
  //iteraror: AsyncIterator<Chunk>;
  file: File;
}

export interface ChatState {
  user: User | null;
  contacts: Array<Contact>;
  channels: Array<Channel>;
  messages: Array<ChatMessage>;
  uploads: Array<FileUpload>;
  focus: string | number | null;
}

export const initialState: ChatState = {
  user: null,
  contacts: [],
  channels: [],
  messages: [],
  uploads: [],
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
        date: new Date().toISOString(),
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
  on(ChatActions.serverRejectedMessage, (state, { pendingId }) => ({
    ...state,
    messages: [
      ...state.messages.map<ChatMessage>((m) =>
        m.id === pendingId ? { ...m, status: MessageStatus.Error } : m
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
  }),
  on(ChatActions.acceptedFile, (state, info) => ({
    ...state,
    messages: [
      ...state.messages,
      {
        id: info.id,
        channel: info.to,
        date: new Date().toISOString(),
        from: state.user?.username ?? '',
        status: MessageStatus.Pending,
        file: {
          name: info.file.name,
          done: true,
          blob: info.file,
          size: info.file.size,
          downloaded: info.file.size,
        },
      },
    ],
    uploads: [...state.uploads, info],
  })),
  on(ChatActions.incomingFileInfo, (state, info) => {
    const { id, from, date, channel, filename, size } = info;
    return {
      ...state,
      messages: [
        ...state.messages,
        {
          id,
          from,
          channel,
          date,
          status: MessageStatus.Pending,
          file: {
            name: filename,
            done: false,
            size,
            downloaded: 0,
          },
        },
      ],
    };
  }),
  on(ChatActions.incomingFileChunk, (state, { id, chunkSize }) => {
    const message = state.messages.find((m) => m.id === id);

    if (!message?.file || message.from === state.user?.username) {
      return state;
    }

    /* const oldBuffer = message?.file?.buffer ?? new Uint8Array(0);
    const buffer = new Uint8Array(oldBuffer.length + chunk.length);
    buffer.set(oldBuffer);
    buffer.set(chunk, oldBuffer.length);
    console.log(buffer);
 */
    const downloaded = message.file.downloaded + chunkSize;
    //const done = downloaded === message.file.size;

    return {
      ...state,
      messages: [
        ...state.messages.map((m) =>
          m.id === id
            ? {
                ...m,
                file: {
                  ...m.file!,
                  downloaded,
                },
              }
            : m
        ),
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
