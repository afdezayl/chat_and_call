import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { logoutConfirmed } from '@chat-and-call/auth/feature-auth-web';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ChannelType,
  visibleChannelsTypes,
} from 'libs/channels/shared/src/lib';
import { EMPTY, of, throwError } from 'rxjs';
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
import { v4 } from 'uuid';
import { ChatSocketService } from '../services/chat-socket.service';
import * as ChatActions from './chat.actions';

@Injectable()
export class ChatEffects {
  loadChannels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.loadChannels),
      mergeMap(() =>
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
          map((channels) => ChatActions.addChannels({ channels })),
          catchError((error) => {
            // TODO: Handle error
            console.error(error);
            return of(ChatActions.loadChannelsFailure({ error }));
          })
        )
      )
    );
  });

  addChannels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.addChannels),
      mergeMap(({ channels }) => {
        return [
          ...channels.map((ch) => {
            switch (ch.type) {
              case ChannelType.Personal:
              case ChannelType.Public:
              case ChannelType.Private:
                return ChatActions.subscribeChannel({ channel: ch.id });
              case ChannelType.FileInfo:
                return ChatActions.subscribeFileInfoChannel({ channel: ch.id });
              case ChannelType.File:
                return ChatActions.subscribeFileChannel({ channel: ch.id });
              default:
                return ChatActions.serverFailMessage();
            }
          }),
        ];
      })
    )
  );

  createChannel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.createChannel),
      mergeMap(({ channel }) =>
        this.chatSocket.createChannel(channel).pipe(
          map((channel) => ChatActions.channelCreated({ channel })),
          catchError((err) => {
            console.error(err);
            return of(ChatActions.channelCreationFailure());
          })
        )
      )
    )
  );

  channelCreated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.channelCreated),
      map(({ channel }) => ChatActions.addChannels({ channels: [channel] }))
    )
  );

  createLocalMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      map(({ message }) =>
        ChatActions.sendMessageToserver({ message, pendingId: v4() })
      )
    )
  );

  publishMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.sendMessageToserver),
      mergeMap((m) =>
        this.chatSocket.publishMessage(m.message).pipe(
          map(({ id }) =>
            ChatActions.serverReceivedMessage({ pendingId: m.pendingId, id })
          ),
          catchError((err) => {
            return of(
              ChatActions.serverRejectedMessage({ pendingId: m.pendingId })
            );
          })
        )
      )
    );
  });

  sendFileInitial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendFileInfoToServer),
      mergeMap(({ to, file }) =>
        this.chatSocket.sendFile(file, to).pipe(
          map(({ id }) => ChatActions.acceptedFile({ id, file, to })),
          catchError(() => of(ChatActions.rejectedFile()))
        )
      )
    )
  );

  subscribeChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.subscribeChannel),
      mergeMap(({ channel }) =>
        this.chatSocket.subscribeToChannel(channel).pipe(
          map((message) => ChatActions.incomingMessage({ message })),
          catchError((err) => of(ChatActions.serverFailMessage()))
        )
      )
    );
  });
  subscribeFileInfoChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.subscribeFileInfoChannel),
      mergeMap(({ channel }) =>
        this.chatSocket.subscribeToFileInfoChannel(channel).pipe(
          map(({ id, channel, from, filename, size }) =>
            ChatActions.incomingFileInfo({
              id,
              channel,
              from,
              filename,
              size,
              date: new Date().toISOString(),
            })
          ),
          catchError((err) => of(ChatActions.serverFailMessage()))
        )
      )
    );
  });

  subscribeFileChannel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.subscribeFileChannel),
      mergeMap(({ channel }) =>
        this.chatSocket.subscribeToFileChannel(channel).pipe(
          map((message) => ChatActions.incomingFileChunk()),
          catchError((err) => of(ChatActions.serverFailMessage()))
        )
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
