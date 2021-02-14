import { Injectable } from '@angular/core';
import {
  BasicMessage,
  Channel,
  ChannelType,
  Message,
} from '@chat-and-call/channels/shared';
import { CHUNK_SIZE_BYTES } from '@chat-and-call/socketcluster/shared';
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

  async sendFile(file: Blob) {
    for await (const chunk of this.blobSlicer(file)) {
      if (chunk) {
        await this.socket.sendFileChunk(chunk);
      }
    }
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
    const protoMessage = message; //new MessageDTO(message);
    return this.socket.publishToChannel<{ id: string }>(
      protoMessage,
      message.channel
    );
  }

  videoCall(description: RTCSessionDescriptionInit) {
    return this.socket.post('channels/call', description);
  }

  close() {
    return this.socket.close();
  }

  private blobSlicer(file: Blob) {
    return {
      [Symbol.asyncIterator]() {
        let i = 0;
        let offset = 0;
        const end = file.size;

        return {
          async next() {
            if (offset < end) {
              const data = await blobToUint8(
                file.slice(offset, offset + CHUNK_SIZE_BYTES)
              );

              const chunk = { order: i++, data: data };
              offset += CHUNK_SIZE_BYTES;
              return { value: chunk, done: false };
            }

            return { done: true, value: null };
          },
        };
      },
    };
  }
}

const blobToUint8 = (blob: Blob): Promise<Uint8Array> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };

    reader.readAsArrayBuffer(blob);
  });
};
