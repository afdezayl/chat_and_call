import { Injectable } from '@angular/core';
import { SocketService } from '@chat-and-call/socketcluster/socket-client-web';
import { LoginRequestDto } from '@chat-and-call/auth/shared-auth-interfaces';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private socket: SocketService) {}

  sendLoginRequest(request: LoginRequestDto): Observable<boolean> {
    return this.socket.post('auth/login', request);
  }
}
