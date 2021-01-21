import {
  AfterViewInit,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { ControlErrorComponent } from './control-error/control-error.component';

@Directive({
  selector: 'mat-form-field[customErrors]',
})
export class CustomErrorsDirective implements OnInit, AfterViewInit {
  @Input('customErrors')
  errors = {};
  @Input()
  excludedErrors: Array<string> = [];

  @ContentChild(MatFormFieldControl) control: MatFormFieldControl<any>;

  ref: ComponentRef<ControlErrorComponent>;

  constructor(
    private vcr: ViewContainerRef,
    private elementRef: ElementRef,
    private resolver: ComponentFactoryResolver
  ) {
    this.ref = this.createErrorComponent();
  }

  ngOnInit(): void {
    const native = this.elementRef.nativeElement;
    const errorWrapper: HTMLDivElement = native.querySelector(
      'div.mat-form-field-subscript-wrapper'
    );
    // maybe in the future
    const hintWrapper: HTMLDivElement = native.querySelector(
      'div.mat-form-field-hint-wrapper'
    );

    const error: Element = this.ref.location.nativeElement;
    errorWrapper.insertAdjacentElement('afterbegin', error);
  }

  ngAfterViewInit(): void {
    const control = this.control.ngControl.control;

    control.statusChanges.pipe().subscribe((status) => {
      console.log(status);
      const controlErrors = control.errors ?? {};
      const firstError = this.getFirstError(controlErrors);

      if (firstError && control.touched) {
        const text = this.errors[firstError] ?? `__${firstError}`;
        this.setError(text);
      } else {
        this.setError(null);
      }
    });
  }

  getFirstError(errors: ValidationErrors): string | null {
    return Object.keys(errors)?.filter(
      (err) => !this.excludedErrors.includes(err)
    )[0];
  }

  setError(text: string) {
    this.ref.instance.message = text;
  }

  private createErrorComponent() {
    const factory = this.resolver.resolveComponentFactory(
      ControlErrorComponent
    );

    return this.vcr.createComponent(factory);
  }
}
