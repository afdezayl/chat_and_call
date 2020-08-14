import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  concatMap,
  mergeMap,
  tap,
  switchMap,
} from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as ChatActions from './chat.actions';
import { ChatSocketService } from '../services/chat-socket.service';

@Injectable()
export class ChatEffects {
  loadChannels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.loadChannels),
      concatMap(() =>
        this.chatSocket.getChannels().pipe(
          switchMap((channels) => [
            ChatActions.addChannels({ channels }),
            ...channels.map((ch) =>
              ChatActions.subscribeChannel({ channel: ch.id })
            ),
          ]),
          catchError((error) => {
            // TODO: Handle error
            console.error(error);
            return of(ChatActions.loadChannelsFailure({ error }));
          })
        )
      )
    );
  });

  publishMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      mergeMap((x) =>
        this.chatSocket.publishMessage(x.message).pipe(
          map((_) => ChatActions.serverReceivedMessage({ message: x.message })),
          catchError((err) => {
            // TODO: Handle error
            console.error(err);
            return of(ChatActions.serverFailMessage({ message: x.message }));
          })
        )
      )
    );
  });

  subscribeChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.subscribeChannel),
      mergeMap(({ channel }) =>
        this.chatSocket
          .subscribeToChannel(channel)
          .pipe(map((message) => ChatActions.incomingMessage({ message })))
      )
    );
  });

  constructor(
    private actions$: Actions,
    private chatSocket: ChatSocketService
  ) {}
}
