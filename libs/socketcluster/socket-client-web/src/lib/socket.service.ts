import { Injectable } from '@angular/core';
import {
  FileChunk,
  ProtobufCodecEngine,
  SOCKET_PATH,
  TOKEN_KEY,
  InMemoryEngine,
} from '@chat-and-call/socketcluster/shared';
import { SocketCrudModel } from '@chat-and-call/socketcluster/utils-crud-server';
import { EMPTY, from, Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AGClientSocket, create } from 'socketcluster-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private _authenticated$ = new Subject<string>();
  private _deauthenticated$ = new Subject<void>();
  private _socket!: AGClientSocket;

  constructor() {
    const codec = new ProtobufCodecEngine();
    this._socket = create({
      path: SOCKET_PATH,
      authTokenName: TOKEN_KEY,
      autoReconnect: true,
      autoConnect: true,
      codecEngine: codec,
      authEngine: new InMemoryEngine(),
    });

    (async () => {
      for await (const { authToken, signedAuthToken } of this._socket.listener(
        'authenticate'
      )) {
        this._authenticated$.next(authToken.username);
      }
    })();
    async () => {
      for await (const {} of this._socket.listener('deauthenticate')) {
        this._deauthenticated$.next();
      }
    };
  }

  get authenticated$() {
    return this._authenticated$.asObservable();
  }
  get deauthenticated$() {
    return this._deauthenticated$.asObservable();
  }

  close() {
    return from(this._socket.deauthenticate()).pipe(
      tap(() => {
        this._socket.killAllChannels();
        //this._socket.killAllListeners();
        this._socket.killAllProcedures();
        this._socket.killAllReceivers();
        this._socket.disconnect(undefined);
      })
    );
  }

  sendFile(file: Blob) {
    this._socket.send(file);
  }

  async sendFileChunk(chunk: { order: number; data: Uint8Array }) {
    const message = FileChunk.create(chunk);

    return this._socket.transmit('aaaaa', message);
  }

  publishToChannel<T = any>(data: any, channel: string) {
    //return from(this._socket.transmitPublish(channel, data));
    return <Observable<T>>from(this._socket.invoke('#channels/publish', data));
  }

  get<T = any>(path: string, request: any) {
    return this._execute<T>('GET', path, request);
  }

  post<T = any>(path: string, request: any): Observable<T> {
    return this._execute<T>('POST', path, request);
  }

  put<T = any>(path: string, request: any): Observable<T> {
    return this._execute<T>('PUT', path, request);
  }

  delete<T = any>(path: string, request: any): Observable<T> {
    return this._execute<T>('DELETE', path, request);
  }

  subscribeToChannel(id: number | string) {
    return this._socket.subscribe(id.toString());
  }

  private _execute<T>(
    method: string,
    path: string,
    request: any
  ): Observable<T> {
    const payload: SocketCrudModel = {
      method,
      path,
      body: request,
    };

    const response$ = of(EMPTY).pipe(
      switchMap(() =>
        this._socket.invoke(`#${method.toLowerCase()}:${path}`, payload)
      )
    ) as Observable<T>;

    return response$;
  }
}
