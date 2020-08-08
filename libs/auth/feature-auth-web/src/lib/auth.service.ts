import { Injectable } from '@angular/core';
import { LoginRequestDto, SignupRequestDto } from '@chat-and-call/auth/shared';
import { Observable, config } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  sendLoginRequest(request: LoginRequestDto): Observable<string> {
    return this.http
      .post<{ token: string }>('api/auth/login', request, {
        withCredentials: true,
      })
      .pipe(map((x) => x.token));
  }

  sendSignupRequest(request: SignupRequestDto): Observable<boolean> {
    return this.http.post<boolean>('api/auth/signup', request);
  }

  isUsernameAvailable(username: string) {
    console.log('service', username);
    return this.http.get<boolean>('api/auth/username', {
      params: {
        user: username,
      },
    });
  }
}
