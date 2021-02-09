import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
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
  sendSignupRequest,
  signupError,
} from '@chat-and-call/auth/feature-auth-web';
import {
  emailValidator,
  MustMatchValidator,
} from '@chat-and-call/utils/forms-shared';
import { Store } from '@ngrx/store';
import { AuthService } from 'libs/auth/feature-auth-web/src/lib/auth.service';
import { Observable, Subject, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { signupErrors } from './signup-i18n-errors';

@Component({
  selector: 'chat-and-call-signup-layout',
  templateUrl: './signup-layout.component.html',
  styleUrls: ['./signup-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupLayoutComponent implements OnInit, OnDestroy {
  //#region Form
  usernameControl = this.fb.control('', {
    validators: [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
      Validators.pattern(/^[A-Z][0-9A-Z]{3,19}$/i),
    ],
    asyncValidators: this.isUsernameAvailable().bind(this),
  });

  emailControl = this.fb.control(
    '',
    [Validators.required, emailValidator],
    [this.isEmailAvailable().bind(this)]
  );

  passwordControl = this.fb.control('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(20),
  ]);

  password2Control = this.fb.control('', [Validators.required]);

  form: FormGroup = this.fb.group(
    {
      username: this.usernameControl,
      email: this.emailControl,
      password: this.passwordControl,
      password2: this.password2Control,
    },
    {
      validators: MustMatchValidator('password', 'password2'),
    }
  );
  //#endregion

  errors = signupErrors;

  showPassword = false;
  showPassword2 = false;

  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AuthState>,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store
      .select(signupError)
      .pipe(
        filter((x) => x !== null),
        tap((x) => {
          this.usernameControl.updateValueAndValidity();
          this.emailControl.updateValueAndValidity();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.form.valid) {
      const request = this.form.value;
      this.store.dispatch(sendSignupRequest(request));
    }
  }

  isUsernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(1000).pipe(
        map((_) => <string>control.value ?? ''),
        switchMap((username) => this.authService.isUsernameAvailable(username)),
        map((isAvailable) => (isAvailable ? null : { unavailable: true })),
        tap((_) => {
          control.markAsTouched();
          this.cdr.markForCheck();
        })
      );
    };
  }

  isEmailAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(1000).pipe(
        map((_) => <string>control.value ?? ''),
        switchMap((email) => this.authService.isEmailAvailable(email)),
        map((isAvailable) => (isAvailable ? null : { unavailable: true })),
        tap((_) => {
          control.markAsTouched();
          this.cdr.markForCheck();
        })
      );
    };
  }
}
