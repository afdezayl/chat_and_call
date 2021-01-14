import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getChannels } from '../../+state/chat.selectors';
import { setFocus } from '../../+state/chat.actions';

@Component({
  selector: 'chat-and-call-channel-selector',
  templateUrl: './channel-selector.component.html',
  styleUrls: ['./channel-selector.component.scss'],
})
export class ChannelSelectorComponent implements OnInit {
  channels$ = this.store.select(getChannels);

  constructor(private store: Store) {}

  ngOnInit(): void {}

  setFocus(id: number) {
    this.store.dispatch(setFocus({ id: id.toString() }));
  }
}
