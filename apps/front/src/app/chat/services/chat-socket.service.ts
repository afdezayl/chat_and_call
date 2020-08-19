import { Injectable } from '@angular/core';
import { BasicMessage, Channel, Message } from '@chat-and-call/channels/shared';
import { SocketService } from '@chat-and-call/socketcluster/socket-client-web';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { userAuthenticated } from '../+state/chat.actions';
@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  constructor(private socket: SocketService, store: Store) {
    socket.authenticated$.subscribe((username) => {
      store.dispatch(userAuthenticated({ username }));
    });
  }

  getChannels(): Observable<Array<Channel>> {
    return this.socket.get<Array<Channel>>('channels/', null);
  }

  subscribeToChannel(id: number | string) {
    const subject$ = new ReplaySubject<Message>();

    (async () => {
      for await (const data of this.socket.subscribeToChannel(id)) {
        subject$.next(data);
      }
    })();

    return subject$.asObservable();
  }

  publishMessage(message: BasicMessage) {
    return this.socket.publishToChannel<void>(message, message.channel);
  }

  videoCall(description: RTCSessionDescriptionInit) {
    return this.socket.post('channels/call', description);
  }

  // Creates backpressure...
  private createSubjectFromIterator<T>(asyncIterable: any): ReplaySubject<T> {
    const subject$ = new ReplaySubject<T>();
    const iterator = asyncIterable[Symbol.asyncIterator]();

    const push = async () => {
      const { done, value } = await iterator.next();

      if (done && value === undefined) {
        subject$.complete();
      } else {
        subject$.next(value);
        push();
      }
    };

    push();
    return subject$;
  }
}