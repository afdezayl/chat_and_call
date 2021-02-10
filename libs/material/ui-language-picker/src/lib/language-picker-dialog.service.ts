import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LanguagePickerComponent } from './language-picker/language-picker.component';

@Injectable({
  providedIn: 'root',
})
export class LanguagePickerDialogService {
  constructor(private dialog: MatDialog, private sso: ScrollStrategyOptions) {}

  show() {
    const scrollStrategy = this.sso.reposition({ scrollThrottle: 150 });
    const dialog = this.dialog.open(LanguagePickerComponent, {
      disableClose: true,
      scrollStrategy,
      maxHeight: '100%',
      panelClass: 'dialog-overflowY',
    });
  }
}
