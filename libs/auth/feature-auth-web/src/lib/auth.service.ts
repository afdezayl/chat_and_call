import { Injectable } from '@angular/core';
import { LoginRequestDto, SignupRequestDto } from '@chat-and-call/auth/shared';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HttpStatus } from '@chat-and-call/utils/forms-shared';

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

  sendSignupRequest(request: SignupRequestDto): Observable<void> {
    return this.http.post<void>('api/auth/signup', request).pipe(
      catchError((err: HttpErrorResponse) => {
        let error: string;
        // TODO: Custom objects to handle errors? Something like Rust/Elm approach
        switch (err.status) {
          case HttpStatus.CONFLICT:
            error = `conflict`;
          case HttpStatus.INTERNAL_SERVER_ERROR:
            error = 'server error';
          default:
            error = err.message;
        }

        return throwError(new Error(error));
      })
    );
  }

  isUsernameAvailable(username: string) {
    return this.http.get<boolean>('api/auth/username', {
      params: {
        user: username,
      },
    });
  }
}
