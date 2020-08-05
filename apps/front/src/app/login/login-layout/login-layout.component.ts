import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  AuthState,
  sendLoginRequest,
  isLogged,
  isValidAttempt,
} from '@chat-and-call/auth/feature-auth-web';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
  FormArray,
} from '@angular/forms';
import { LoginRequestDto } from '@chat-and-call/auth/shared';
import { isEmpty } from 'class-validator';

@Component({
  selector: 'chat-and-call-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginLayoutComponent {
  form: FormGroup = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    password: this.fb.control('', [Validators.required])
  });
  authorizeState$ = this.store.pipe(select(isLogged));
  isValidLoginAttempt$ = this.store.pipe(select(isValidAttempt));

  constructor(private store: Store<AuthState>, private fb: FormBuilder) {}

  onSubmit() {
    //console.log(this.getErrorsByControl(this.form));
    if (this.form.valid) {
      const loginRequest: LoginRequestDto = this.form.value;

      this.store.dispatch(sendLoginRequest(loginRequest));
      return;
    }
    return;
  }

  getErrorsByControl(abstractControl: AbstractControl) {
    if (abstractControl instanceof FormControl) {
      return abstractControl.errors;
    } else if (abstractControl instanceof FormGroup) {
      const forChildrenErrors = {};
      for (const [key, control] of Object.entries(abstractControl.controls)) {
        const errors = this.getErrorsByControl(control);
        forChildrenErrors[key] = errors;
      }
      return forChildrenErrors;
    } else if (abstractControl instanceof FormArray) {
      const forChildrenErrors = [];
      for (const [key, control] of Object.entries(abstractControl.controls)) {
        const errors = this.getErrorsByControl(control);
        forChildrenErrors[key] = errors;
      }
      return forChildrenErrors;
    }
  }
}
