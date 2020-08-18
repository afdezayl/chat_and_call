import { Injectable } from '@angular/core';
import { SOCKET_PATH, TOKEN_KEY } from '@chat-and-call/socketcluster/shared';
import { SocketCrudModel } from '@chat-and-call/socketcluster/utils-crud-server';
import { from, Observable, BehaviorSubject, EMPTY, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AGClientSocket, create } from 'socketcluster-client';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private _authenticated$ = new BehaviorSubject<string>(null);
  private _deauthenticated$ = new BehaviorSubject<void>(null);
  private _socket: AGClientSocket = null;

  constructor() {
    this._socket = create({
      path: SOCKET_PATH,
      authTokenName: TOKEN_KEY,
      autoReconnect: true,
      autoConnect: true,
    });

    (async () => {
      for await (const { authToken, signedAuthToken } of this._socket.listener(
        'authenticate'
      )) {
        this._authenticated$.next(authToken.username);
      }
    })();

    (async () => {
      for await (const x of this._socket.listener(
        'authStateChange'
      )) {
        console.log('auth change', x);
      }
    })();
  }

  get authenticated$() {
    return this._authenticated$.asObservable();
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
