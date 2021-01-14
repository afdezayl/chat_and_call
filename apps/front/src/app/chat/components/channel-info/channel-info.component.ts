import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getFocusedChannel,
  getMessagesFromFocusChannel,
} from '../../+state/chat.selectors';

@Component({
  selector: 'chat-and-call-channel-info',
  templateUrl: './channel-info.component.html',
  styleUrls: ['./channel-info.component.scss'],
})
export class ChannelInfoComponent implements OnInit {
  focus$ = this.store.select(getFocusedChannel);
  messages$ = this.store.select(getMessagesFromFocusChannel);

  constructor(private store: Store) {}

  ngOnInit(): void {}
}
