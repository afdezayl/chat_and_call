import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap } from 'rxjs/operators';
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
          map((data) => ChatActions.addChannels({ channels: data })),
          catchError((error) => of(ChatActions.loadChannelsFailure({ error })))
        )
      )
    );
  });

  subscribeChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.subscribeChannel),
      mergeMap(({ channel }) =>
        this.chatSocket
          .subscribeToChannel(channel).asObservable()
          .pipe(map((message) => ChatActions.incomingMessage({ message })))
      )
    );
  });

  constructor(
    private actions$: Actions,
    private chatSocket: ChatSocketService
  ) {}
}
