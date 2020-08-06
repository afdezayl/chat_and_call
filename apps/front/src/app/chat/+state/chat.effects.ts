import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
<<<<<<< HEAD
import {
  catchError,
  map,
  concatMap,
  mergeMap,
  tap,
  switchMap,
} from 'rxjs/operators';
=======
import { catchError, map, concatMap, mergeMap } from 'rxjs/operators';
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
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
<<<<<<< HEAD
          switchMap((channels) => [
            ChatActions.addChannels({ channels }),
            ...channels.map((ch) =>
              ChatActions.subscribeChannel({ channel: ch.id })
            ),
          ]),
          tap((x) => console.log(x)),
=======
          map((data) => ChatActions.addChannels({ channels: data })),
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
          catchError((error) => of(ChatActions.loadChannelsFailure({ error })))
        )
      )
    );
  });

<<<<<<< HEAD
  publishMessage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ChatActions.sendMessage),
        mergeMap((x) => {
          return this.chatSocket.publishMessage(x.message);
        })
      );
    },
    { dispatch: false }
  );

=======
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
  subscribeChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.subscribeChannel),
      mergeMap(({ channel }) =>
        this.chatSocket
<<<<<<< HEAD
          .subscribeToChannel(channel)
          .asObservable()
          .pipe(
            tap((x) => console.log(x)),
            map((message) => ChatActions.incomingMessage({ message }))
          )
=======
          .subscribeToChannel(channel).asObservable()
          .pipe(map((message) => ChatActions.incomingMessage({ message })))
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
      )
    );
  });

  constructor(
    private actions$: Actions,
    private chatSocket: ChatSocketService
  ) {}
}
