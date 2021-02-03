import { createAction, props } from '@ngrx/store';
import { Channel, Message, BasicMessage } from '@chat-and-call/channels/shared';

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
  props<{ channel: string | number }>()
);

export const sendMessage = createAction(
  '[Chat] Send message',
  props<{ message: BasicMessage }>()
);

export const serverReceivedMessage = createAction(
  '[Chat] Received message',
  props<{ message: BasicMessage }>()
);

export const serverFailMessage = createAction(
  '[Chat] Denied message',
  props<{ message: BasicMessage }>()
);

export const incomingMessage = createAction(
  '[Chat] Incoming message',
  props<{ message: Message }>()
);

export const setFocus = createAction(
  '[Chat] Set focus',
  props<{ id: number | string | null }>()
);
