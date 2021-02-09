import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginRequestDto,
  SignupConflictResponseDto,
  SignupRequestDto,
} from '@chat-and-call/auth/shared';
import { HttpStatus } from '@chat-and-call/utils/forms-shared';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

export class Success {}
export class NotAvailableUserOrEmail {
  usernameTaken!: boolean;
  emailTaken!: boolean;

  constructor(value: NotAvailableUserOrEmail) {
    this.emailTaken = value.emailTaken;
    this.usernameTaken = value.usernameTaken;
  }
}
class CacheObject<T = any> {
  key!: string;
  value!: T;
}
class Cache<T> {
  private values: Array<CacheObject<T>> = [];
  private length: number;
  private keyFilter = (key: string) => (c: CacheObject) => c.key === key;

  constructor(length: number) {
    this.length = length;
  }

  clear() {
    this.values = [];
  }

  has(key: string) {
    return this.values.some(this.keyFilter(key));
  }

  getValue(key: string) {
    return this.values.find(this.keyFilter(key))?.value ?? null;
  }

  store(key: string, value: T) {
    if (this.values.length >= this.length) {
      this.values.shift();
    }
    this.values.push({ key, value });
  }

  remove(key: string) {
    const index = this.values.findIndex(this.keyFilter(key));
    if (index > -1) {
      this.values.splice(index, 1);
    }
  }
}

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
  ): Observable<Success | NotAvailableUserOrEmail> {
    return this.http.post<void>('api/auth/signup', request).pipe(
      map(() => of(new Success())),
      catchError((err: HttpErrorResponse) => {
        let error: string;
        switch (err.status) {
          // Strange case, only when other user signup between async validators and form submit
          case HttpStatus.CONFLICT:
            const content = err.error as SignupConflictResponseDto;

            // Remove cache
            this.usernameCache.clear();
            this.emailCache.clear();

            return of(
              new NotAvailableUserOrEmail({
                emailTaken: content.notAvailableEmail,
                usernameTaken: content.notAvailableUsername,
              })
            );
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

  private readonly usernameCache = new Cache<Observable<boolean>>(10);
  isUsernameAvailable(username: string): Observable<boolean> {
    const value = this.usernameCache.getValue(username);
    if (value) {
      return value;
    }
    const obs$ = this.http
      .get<boolean>('api/auth/username', {
        params: {
          user: username,
        },
      })
      .pipe(shareReplay(1));
    this.usernameCache.store(username, obs$);

    return obs$;
  }

  private readonly emailCache = new Cache<Observable<boolean>>(10);
  isEmailAvailable(email: string) {
    const value = this.emailCache.getValue(email);
    if (value) {
      return value;
    }
    const obs$ = this.http
      .get<boolean>('api/auth/email', {
        params: {
          email,
        },
      })
      .pipe(shareReplay(1));
    this.emailCache.store(email, obs$);

    return obs$;
  }
}
