import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemePickerComponent } from './theme-picker.component';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class ThemePickerDialogService {
  constructor(private dialog: MatDialog, private sso: ScrollStrategyOptions) {}

  show() {
    const scrollStrategy = this.sso.reposition({ scrollThrottle: 150 });
    const dialog = this.dialog.open(ThemePickerComponent, {
      disableClose: true,
      scrollStrategy,
      maxHeight: '100%',
      panelClass: 'dialog-overflowY'
    });
  }
}
