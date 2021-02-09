import { Component, OnInit } from '@angular/core';
import { ThemePickerDialogService } from '@chat-and-call/material/ui-theme-picker';

@Component({
  selector: 'chat-and-call-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent implements OnInit {
  constructor(private themePicker: ThemePickerDialogService) {}

  ngOnInit(): void {}
  changeTheme() {
    this.themePicker.show();
  }
  logout() {}
}
