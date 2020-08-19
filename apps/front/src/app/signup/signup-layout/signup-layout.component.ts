import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormArray,
  ValidationErrors,
} from '@angular/forms';
import {
  AuthState,
  sendSignupRequest,
  getUsernameAvailability,
  previousUsernameSearch,
  setUsernameAvailability,
} from '@chat-and-call/auth/feature-auth-web';
import { Store, ActionsSubject } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  map,
  take,
  tap,
  filter,
  switchMap,
  mergeMap,
  distinctUntilChanged,
} from 'rxjs/operators';
import { ofType } from '@ngrx/effects';
import { ValidationError } from 'class-validator';

@Component({
  selector: 'chat-and-call-signup-layout',
  templateUrl: './signup-layout.component.html',
  styleUrls: ['./signup-layout.component.scss'],
})
export class SignupLayoutComponent {
  // TODO: Validations
  form: FormGroup = this.fb.group(
    {
      username: this.fb.control(
        '',
        [Validators.required],
        this.userValidator().bind(this)
      ),
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      password2: this.fb.control('', [Validators.required]),
    },
    {
      validators: this.MustMatchValidator('password', 'password2'),
    }
  );

  constructor(private fb: FormBuilder, private store: Store<AuthState>) {}

  onSubmit() {
    if (this.form.valid) {
      const request = this.form.value;
      this.store.dispatch(sendSignupRequest(request));
    }
  }

  userValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<any> => {
      const username = control.value;

      const sendRequest = (user: string) =>
        this.store.dispatch(getUsernameAvailability({ user }));

      return this.store.select(previousUsernameSearch).pipe(
        debounceTime(1500),
        distinctUntilChanged(),
        tap((last) => {
          control.setErrors({ checking: true });
          control.markAsUntouched();
          if (last.user !== username) {
            sendRequest(username);
          }
        }),
        filter((search) => search.user === username),
        take(1),
        map((search) => {
          control.markAsTouched();
          return search.isAvailable ? null : { unavailable: true };
        })
      );
    };
  }

  MustMatchValidator(controlName: string, matchingControlName: string) {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      const isMatch = control.value === matchingControl.value;

      matchingControl.setErrors(isMatch ? null : { mustMatch: true });
    };
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
