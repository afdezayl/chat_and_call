import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
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
  MustMatchValidator,
} from '@chat-and-call/utils/forms-shared';
import {
  HashMap,
  TranslocoScope,
  TranslocoService,
  TRANSLOCO_SCOPE,
} from '@ngneat/transloco';
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
      username: this.fb.control(
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern(/^[A-Z][0-9A-Z]{3,19}$/i),
        ],
        this.userValidator().bind(this)
      ),
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

  usernameErrorMessages: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private store: Store<AuthState>,
    private cdr: ChangeDetectorRef,
    private transloco: TranslocoService,
    @Inject(TRANSLOCO_SCOPE) private scope: TranslocoScope
  ) {}

  ngOnInit() {
    this.transloco
      .selectTranslate(
        ['unavailableUsername', 'minMaxLength'],
        { min: '4', max: '20' },
        this.scope
      )
      .subscribe(([unavailable, minmax]) => {
        console.log(minmax);
        this.usernameErrorMessages = {
          unavailable,
          minlength: minmax,
          maxlength: minmax,
        };
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const request = this.form.value;
      this.store.dispatch(sendSignupRequest(request));
    }
  }

  userValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<unknown> => {
      const username = control.value;

      const sendRequest = (user: string) =>
        this.store.dispatch(getUsernameAvailability({ user }));

      return this.store.select(previousUsernameSearch).pipe(
        debounceTime(1500),
        distinctUntilChanged(),
        tap((last) => {
          if (last.user !== username) {
            sendRequest(username);
          }
        }),
        filter((search) => search.user === username),
        take(1),
        map((search) => {
          control.markAsTouched();
          return search.isAvailable ? null : { unavailable: true };
        }),
        tap((_) => {
          this.cdr.markForCheck();
        })
      );
    };
  }
}
