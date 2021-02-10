import { Component } from '@angular/core';
import { logoutClick } from '@chat-and-call/auth/feature-auth-web';
import { LanguagePickerDialogService } from '@chat-and-call/material/ui-language-picker';
import { ThemePickerDialogService } from '@chat-and-call/material/ui-theme-picker';
import { Store } from '@ngrx/store';

@Component({
  selector: 'chat-and-call-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent {
  constructor(
    private themePicker: ThemePickerDialogService,
    private store: Store,
    private languagePicker: LanguagePickerDialogService
  ) {}
  changeLang() {
    this.languagePicker.show();
  }

  changeTheme() {
    this.themePicker.show();
  }
  logout() {
    this.store.dispatch(logoutClick());
  }
}
