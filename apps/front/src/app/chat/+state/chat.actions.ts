import {
  BasicMessage,
  Channel,
  ChannelType,
  Message,
} from '@chat-and-call/channels/shared';
import { createAction, props } from '@ngrx/store';

// Authentication
export const userAuthenticated = createAction(
  '[Chat] User authenticated',
  props<{ username: string }>()
);

// Channels
export const loadChannels = createAction('[Chat] Load Channels');
export const loadChannelsFailure = createAction(
  '[Chat] Load Channels Failure',
  props<{ error: any }>()
);
export const addChannels = createAction(
  '[Chat] Add channels',
  props<{ channels: Array<Channel> }>()
);
export const removeChannels = createAction(
  '[Chat] Remove channels',
  props<{ channels: Array<Channel> }>()
);
export const subscribeChannel = createAction(
  '[Chat] Subscribe channel',
  props<{ channel: string }>()
);
export const subscribeFileChannel = createAction(
  '[Chat] Subscribe file chunks channel',
  props<{ channel: string }>()
);
export const subscribeFileInfoChannel = createAction(
  '[Chat] Subscribe file info channel',
  props<{ channel: string }>()
);
export const createChannel = createAction(
  '[Chat] Create channel',
  props<{ channel: { title: string; type: ChannelType } }>()
);
export const channelCreated = createAction(
  '[Chat] Channel created',
  props<{ channel: Channel }>()
);
export const channelCreationFailure = createAction(
  '[Chat] Failed channel creation'
);

// Message
export const sendMessage = createAction(
  '[Chat] Send message',
  props<{ message: BasicMessage }>()
);
export const sendMessageToserver = createAction(
  '[Chat] Send message to server',
  props<{ message: BasicMessage; pendingId: string }>()
);

export const serverReceivedMessage = createAction(
  '[Chat] Received message',
  props<{ id: string; pendingId: string }>()
);
export const serverRejectedMessage = createAction(
  '[Chat] Denied message',
  props<{ pendingId: string }>()
);
export const incomingMessage = createAction(
  '[Chat] Incoming message',
  props<{ message: Message }>()
);
export const ackMessageArrival = createAction(
  '[Chat] Message arrives to destiny',
  props<{ id: string }>()
);
export const ackMessageReaded = createAction(
  '[Chat] Message readed',
  props<{ id: string }>()
);

// File
export const sendFileInfoToServer = createAction(
  '[Chat] Send file info',
  props<{ to: string; file: File }>()
);
export const acceptedFile = createAction(
  '[Chat] File accepted',
  props<{ file: File; to: string; id: string }>()
);
export const rejectedFile = createAction('[Chat] Server rejected file');
export const incomingFileInfo = createAction(
  '[Chat] Incoming file info',
  props<{
    id: string;
    channel: string;
    from: string;
    filename: string;
    size: number;
    date: string;
  }>()
);

export const sendFileChunk = createAction('[Chat] Send file chunk');
export const incomingFileChunk = createAction('[Chat] Incoming file chunk');
export const rejectedChunk = createAction('[Chat] Rejected chunk');

export const requestFile = createAction('[Chat] Request file');
export const requestFileChunk = createAction('[Chat] Request file chunk');

// General
export const serverFailMessage = createAction('[Chat] Denied request');
export const setFocus = createAction(
  '[Chat] Set focus',
  props<{ id: number | string | null }>()
);
export const closeSocket = createAction('[Chat] Close socket');
export const cleanChatStore = createAction('[Chat] Clean store');
