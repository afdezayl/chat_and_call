import { Injectable } from '@angular/core';
import {
  BasicMessage,
  Channel,
  ChannelType,
  Message,
} from '@chat-and-call/channels/shared';
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

  createChannel(channel: {
    title: string;
    type: ChannelType;
  }): Observable<Channel> {
    switch (channel.type) {
      case ChannelType.Private:
        return this.socket.post<Channel>('channels/private', {
          title: channel.title,
        });
      case ChannelType.Public:
        return this.socket.post<Channel>('channels/public', {
          title: channel.title,
        });
      default:
        throw new Error('Unimplemented');
    }
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

  close() {
    return this.socket.close();
  }
}
