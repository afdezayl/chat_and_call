import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequestDto, SignupRequestDto } from '@chat-and-call/auth/shared';
import { HttpStatus } from '@chat-and-call/utils/forms-shared';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class Success {}
export class NotAvailableUser {}
export class NotAvailableEmail {}

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

  sendSignupRequest(
    request: SignupRequestDto
  ): Observable<Success | NotAvailableEmail | NotAvailableUser> {
    return this.http.post<void>('api/auth/signup', request).pipe(
      map(() => of(new Success())),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        let error: string;
        // TODO: Custom objects to handle errors? Something like Rust/Elm approach
        switch (err.status) {
          case HttpStatus.CONFLICT:
            error = `conflict`;
            return of(new NotAvailableEmail());
            break;
          case HttpStatus.INTERNAL_SERVER_ERROR:
            error = 'server error';
            break;
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
