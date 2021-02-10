import { Component, OnInit } from '@angular/core';
import { logoutClick } from '@chat-and-call/auth/feature-auth-web';
import { ThemePickerDialogService } from '@chat-and-call/material/ui-theme-picker';
import { Store } from '@ngrx/store';

@Component({
  selector: 'chat-and-call-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent implements OnInit {
  constructor(
    private themePicker: ThemePickerDialogService,
    private store: Store
  ) {}

  ngOnInit(): void {}
  changeTheme() {
    this.themePicker.show();
  }
  logout() {
    this.store.dispatch(logoutClick());
  }
}
