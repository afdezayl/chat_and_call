import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  LoginRequestDto,
  SignupRequestDto,
} from '@chat-and-call/auth/shared-auth-interfaces';
import {
  AuthState,
  sendLoginRequest,
  isLogged,
} from '@chat-and-call/auth/feature-auth-web';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocketService } from '@chat-and-call/socketcluster/socket-client-web';

@Component({
  selector: 'chat-and-call-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Chat&Call';
  form: FormGroup = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });
  form2: FormGroup = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required]),
  });
  authorizeState$ = this.store.pipe(select(isLogged));

  constructor(
    private store: Store<AuthState>,
    private fb: FormBuilder,
    private socket: SocketService
  ) {}

  sendPost() {
    this.socket
      .post('dev/echo', { message: 'Hello!' })
      .subscribe(console.log, console.error);
  }

  onSubmit() {
    if (this.form.valid) {
      const loginRequest: LoginRequestDto = this.form.value;

      this.store.dispatch(sendLoginRequest({ request: loginRequest }));
      return;
    }
    console.log('Invalid', this.form.controls);
  }

  onSubmit2() {
    if (this.form2.valid) {
      const signupRequest: SignupRequestDto = this.form2.value;

      this.socket
        .post<boolean>('auth/signup', signupRequest)
        .subscribe(console.log, console.error);
    }
  }
}
