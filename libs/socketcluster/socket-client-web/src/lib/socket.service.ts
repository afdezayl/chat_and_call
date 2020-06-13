import { Injectable } from '@angular/core';
import { AGClientSocket, create } from 'socketcluster-client';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
