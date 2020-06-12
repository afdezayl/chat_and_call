import { Injectable } from '@angular/core';
import { AGClientSocket, create } from 'socketcluster-client';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public authenticated$;
  private _socket: AGClientSocket = null;

  constructor() {
    console.log('creating socket service...');
    this._socket = create({ path: '/socket' });
  }

  get<T>(path: string, request: any) {
    return this._execute('GET', path, request);
  }

  post<T>(path: string, request: any): Observable<T> {
    return this._execute('POST', path, request);
  }

  put<T>(path: string, request: any): Observable<T> {
    return this._execute('PUT', path, request);
  }

  delete<T>(path: string, request: any): Observable<T> {
    return this._execute('DELETE', path, request);
  }

  private _execute<T>(
    method: string,
    path: string,
    request: any
  ): Observable<T> {
    const payload = {
      method,
      path,
      body: request,
    };
    const response$ = from(
      this._socket.invoke(`#${method.toLowerCase()}:${path}`, payload)
    ) as Observable<T>;

    return response$;
  }
}
