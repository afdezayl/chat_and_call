import {
  AfterViewInit,
  ContentChild,
  Directive,
  Host,
  HostListener,
  Input,
  OnDestroy,
  Optional,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { HashMap } from '@ngneat/transloco';
import { EMPTY, merge, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ControlErrorComponent } from './control-error/control-error.component';
import { ControlErrorsContainerDirective } from './control-errors-container.directive';

@Directive({
  selector: 'mat-form-field[controlErrors]',
})
export class ControlErrorsDirective implements AfterViewInit, OnDestroy {
  // TODO: move to component and rename component
  @Input('controlErrors')
  errors!: Array<ErrorTranslation>;
  @Input()
  excludedErrors: Array<string> = [];

  @ContentChild(MatFormFieldControl) formField!: MatFormFieldControl<any>;
  @ContentChild(ControlErrorComponent) wrapper!: ControlErrorComponent;

  submit$: Observable<Event>;
  focusLost$ = new Subject<void>();
  destroy$ = new Subject<void>();

  constructor(
    @Optional() @Host() private form: ControlErrorsContainerDirective
  ) {
    this.submit$ = this.form?.submit$ ?? EMPTY;
  }

  @HostListener('focusout')
  onFocusLost() {
    this.focusLost$.next();
  }

  ngAfterViewInit(): void {
    if (!this.formField?.ngControl?.control) {
      console.error(`Form control not found.`);
      return;
    }

    const { control, name } = this.formField.ngControl;

    if (!this.wrapper) {
      console.error(
        `Not found-> "<mat-error autofillErrors><mat-error>" inside '${name}' control`
      );
      return;
    }

    merge(
      this.submit$,
      control.statusChanges,
      control.valueChanges,
      this.focusLost$
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) => {
        const controlErrors = control.errors ?? {};
        const firstError = this.getFirstError(controlErrors);

        if (firstError) {
          const error =
            this.errors.find((err) => err.error === firstError) ??
            `__${firstError}`;

          this.wrapper.setError(error);
        } else {
          this.wrapper.setError(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getFirstError(errors: ValidationErrors): string | null {
    return Object.keys(errors)?.filter(
      (err) => !this.excludedErrors.includes(err)
    )[0];
  }
}

export interface ErrorTranslation {
  error: string;
  literal: string;
  params?: HashMap;
  scope?: string;
}
