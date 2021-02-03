import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { HashMap } from '@ngneat/transloco';
import { ErrorTranslation } from '../';

@Component({
  selector: 'mat-error[autofillErrors]',
  templateUrl: './control-error.component.html',
  styleUrls: ['./control-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlErrorComponent {
  _error: { literal: string; params?: HashMap } | null = null;
  _alternativeMessage: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  setError(error: null | string | ErrorTranslation) {
    if (error === null) {
      this._error = null;
      this._alternativeMessage = null;
    } else if (typeof error === 'string') {
      this._error = null;
      this._alternativeMessage = error;
    } else {
      this._error = {
        literal: `${error.scope ? `${error.scope}.` : ''}${error.literal}`,
        params: error.params,
      };
      this._alternativeMessage = null;
    }
    this.cdr.markForCheck();
  }
}

export interface TranslateObject {
  literal: string;
  params?: HashMap;
  scope?: string;
}
