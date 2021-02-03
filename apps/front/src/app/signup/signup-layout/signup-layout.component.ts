import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  AuthState,
  getUsernameAvailability,
  previousUsernameSearch,
  sendSignupRequest,
} from '@chat-and-call/auth/feature-auth-web';
import {
  emailValidator,
  ErrorTranslation,
  MustMatchValidator,
} from '@chat-and-call/utils/forms-shared';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  take,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'chat-and-call-signup-layout',
  templateUrl: './signup-layout.component.html',
  styleUrls: ['./signup-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupLayoutComponent {
  // TODO: Validations
  form: FormGroup = this.fb.group(
    {
      username: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern(/^[A-Z][0-9A-Z]{3,19}$/i),
        ],
        asyncValidators: this.userValidator().bind(this),
      }),
      email: this.fb.control('', [Validators.required, emailValidator]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]),
      password2: this.fb.control('', [Validators.required]),
    },
    {
      validators: MustMatchValidator('password', 'password2'),
    }
  );

  usernameErrorMessages: Array<ErrorTranslation> = [
    {
      error: 'minlength',
      literal: 'minMaxLength',
      params: { min: '4', max: '20' },
      scope: 'signup',
    },
    {
      error: 'required',
      literal: 'requiredField',
    },
    {
      error: 'pattern',
      literal: 'signup.usernamePattern',
    },
    {
      error: 'unavailable',
      literal: 'unavailableUsername',
      scope: 'signup',
    },
  ];

  emailErrorMessages: Array<ErrorTranslation> = [
    {
      error: 'required',
      literal: 'requiredField',
    },
    {
      error: 'email',
      literal: 'invalidEmail',
      scope: 'signup',
    },
  ];

  passwordErrorMessages: Array<ErrorTranslation> = [
    {
      error: 'required',
      literal: 'requiredField',
    },
    {
      error: 'minlength',
      literal: 'minMaxLength',
      params: { min: '4', max: '20' },
      scope: 'signup',
    },
  ];

  passsword2ErrorMessages: Array<ErrorTranslation> = [
    {
      error: 'required',
      literal: 'requiredField',
    },
    {
      error: 'mustMatch',
      literal: 'notMatchingPasswords',
      scope: 'signup',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store<AuthState>,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    if (this.form.valid) {
      const request = this.form.value;
      this.store.dispatch(sendSignupRequest(request));
    }
  }

  userValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value;

      const sendRequest = (user: string) =>
        this.store.dispatch(getUsernameAvailability({ user }));

      return this.store.select(previousUsernameSearch).pipe(
        distinctUntilChanged(),
        debounceTime(1500),
        tap((last) => {
          if (last?.user !== username) {
            sendRequest(username);
          }
        }),
        filter((search) => search?.user === username),
        take(1),
        map((search) => {
          control.markAsTouched();
          return search?.isAvailable ? null : { unavailable: true };
        }),
        tap((_) => {
          this.cdr.markForCheck();
        })
      );
    };
  }
}
