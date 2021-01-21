import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AuthState,
  isLogged,
  isValidAttempt,
  sendLoginRequest,
} from '@chat-and-call/auth/feature-auth-web';
import { LoginRequestDto } from '@chat-and-call/auth/shared';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'chat-and-call-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginLayoutComponent {
  form: FormGroup = this.fb.group({
    username: this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: this.fb.control('', [Validators.required]),
  });
  authorizeState$ = this.store.pipe(select(isLogged));
  isValidLoginAttempt$ = this.store.pipe(select(isValidAttempt));

  constructor(private store: Store<AuthState>, private fb: FormBuilder) {}

  onSubmit() {
    if (this.form.valid) {
      const loginRequest: LoginRequestDto = this.form.value;

      this.store.dispatch(sendLoginRequest(loginRequest));
    }
  }
}
