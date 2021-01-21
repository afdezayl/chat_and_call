import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'chat-and-call-control-error',
  template: `<mat-error>{{ _message }}</mat-error>`,
  styleUrls: ['./control-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlErrorComponent extends MatError {
  _message: string = null;

  @Input()
  set message(message: string) {
    if (this._message !== message) {
      this._message = message;
      this.cdr.detectChanges();
    }
  }

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }
}
