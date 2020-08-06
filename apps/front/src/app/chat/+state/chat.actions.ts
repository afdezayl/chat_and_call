import { createAction, props } from '@ngrx/store';
<<<<<<< HEAD
import { Channel, Message, BasicMessage } from '@chat-and-call/channels/shared';
=======
import { Channel, Message } from '@chat-and-call/channels/shared';
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11

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
<<<<<<< HEAD
  props<{ channel: string | number }>()
);

export const sendMessage = createAction(
  '[Chat] Send message',
  props<{ message: BasicMessage }>()
=======
  props<{ channel: string | number}>()
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
);

export const incomingMessage = createAction(
  '[Chat] Incoming message',
  props<{ message: Message }>()
);

export const setFocus = createAction(
  '[Chat] Set focus',
  props<{ id: number | string }>()
);
