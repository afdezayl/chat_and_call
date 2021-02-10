import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { logoutConfirmed } from '@chat-and-call/auth/feature-auth-web';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  map,
  mergeMap,
  retryWhen,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ChatSocketService } from '../services/chat-socket.service';
import * as ChatActions from './chat.actions';

@Injectable()
export class ChatEffects {
  loadChannels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.loadChannels),
      switchMap(() =>
        this.chatSocket.getChannels().pipe(
          retryWhen((errors) =>
            errors.pipe(
              concatMap((e, i) => {
                if (i >= 3) {
                  return throwError(e);
                }
                return of(e).pipe(delay(1000));
              })
            )
          ),
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

  close$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutConfirmed),
      mergeMap(() => this.chatSocket.close()),
      map(() => ChatActions.cleanChatStore()),
      tap(() => this.router.navigate(['home', 'login']))
    )
  );

  constructor(
    private actions$: Actions,
    private chatSocket: ChatSocketService,
    private router: Router
  ) {}
}
