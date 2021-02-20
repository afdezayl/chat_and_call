import { Injectable } from '@angular/core';
import {
  BasicMessage,
  BasicMessageDto,
  Channel,
  ChannelType,
  FileAcceptedDTO,
  FileChunkDTO,
  FileDispatchDTO,
  FileInfoDTO,
  Message,
} from '@chat-and-call/channels/shared';
import { SocketService } from '@chat-and-call/socketcluster/socket-client-web';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { userAuthenticated } from '../+state/chat.actions';
import { FileSlicerService } from './file-slicer.service';

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  constructor(
    private socket: SocketService,
    private store: Store,
    private blobSlicer: FileSlicerService
  ) {
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

  sendFile(file: File, channel: string) {
    const request: FileDispatchDTO = new FileDispatchDTO({
      channel: channel,
      filename: file.name,
      size: file.size,
    });
    return this.socket.post<FileAcceptedDTO>('channels/file_info', request);
  }

  async sendChunks(file: File, channel: string, id: string) {
    console.time(`total -> ${id}`)
    for await (const chunk of this.blobSlicer.blobSlicer(file)) {
      const request: FileChunkDTO = new FileChunkDTO({
        id,
        channel,
        chunk: chunk?.data,
        order: chunk?.order,
      });
      console.time(`${id} - ${chunk?.order}`);
      await this.socket
        .invoke<{ order: number }>('#channels/file_chunk', request)
        .toPromise();

      console.timeEnd(`${id} - ${chunk?.order}`);
    }
    console.timeEnd(`total -> ${id}`)
  }

  subscribeToChannel(id: string) {
    const subject$ = new ReplaySubject<Message>();

    (async () => {
      for await (const data of this.socket.subscribeToChannel(id)) {
        subject$.next(data);
      }
    })();

    return subject$.asObservable();
  }
  subscribeToFileChannel(id: string) {
    const subject$ = new ReplaySubject<FileInfoDTO>();

    (async () => {
      for await (const data of this.socket.subscribeToChannel(id)) {
        subject$.next(data);
      }
    })();

    return subject$.asObservable();
  }
  subscribeToFileInfoChannel(id: string) {
    const subject$ = new ReplaySubject<FileInfoDTO>();

    (async () => {
      for await (const data of this.socket.subscribeToChannel(id)) {
        subject$.next(data);
      }
    })();

    return subject$.asObservable();
  }

  publishMessage(message: BasicMessage) {
    const { channel, text } = message;
    const protoMessage = new BasicMessageDto({ channel, text }); //message; //new MessageDTO(message);
    return this.socket.publishToChannel<{ id: string }>(protoMessage, channel);
  }

  videoCall(description: RTCSessionDescriptionInit) {
    return this.socket.post('channels/call', description);
  }

  close() {
    return this.socket.close();
  }
}
