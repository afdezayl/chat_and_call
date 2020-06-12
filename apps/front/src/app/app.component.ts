import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoginRequestDto } from '@chat-and-call/auth/shared-auth-interfaces';
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
  authorizeState$ = this.store.pipe(select(isLogged));

  constructor(
    private store: Store<AuthState>,
    private fb: FormBuilder
  ) {}

  onSubmit() {
    if (this.form.valid) {
      const loginRequest: LoginRequestDto = this.form.value;
      console.log(loginRequest);
      this.store.dispatch(sendLoginRequest({ request: loginRequest }));
      return;
    }
    console.log('Invalid', this.form.controls);
  }
}
