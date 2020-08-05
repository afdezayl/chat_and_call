import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  loadChannels,
  setFocus,
  subscribeChannel,
} from '../+state/chat.actions';
import {
  getChannels,
  getFocusedChannel,
  getMessages,
  getMessagesFromFocusChannel,
} from '../+state/chat.selectors';
import { ChatSocketService } from '../services/chat-socket.service';
import { Message } from '@chat-and-call/channels/shared';
import {
  tap,
  take,
  debounceTime,
  throttleTime,
  map,
  skip,
  skipWhile,
  takeLast,
  scan,

} from 'rxjs/operators';
import { fromEvent, from, of, Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'chat-and-call-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatLayoutComponent implements OnInit {
  // TODO: separate on components
  // channels-container
  channels$ = this.store.select(getChannels);
  focus$ = this.store.select(getFocusedChannel);

  // messageContainer
  unreaded$ = new BehaviorSubject<number>(0);

  newMessagesCount = 0;
  messages$ = this.store.select(getMessagesFromFocusChannel).pipe(
    skipWhile((x) => x.length === 0),
    map( x => x.slice(-20)),
    tap((x) => {
      this.newMessagesCount++;
    }),

  );

  @ViewChild('message_container') messageContainer: ElementRef<HTMLDivElement>;

  constructor(private store: Store, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store.dispatch(loadChannels());
    this.store.dispatch(subscribeChannel({ channel: '1' }));
  }

  onViewed(isViewed: boolean) {
    if (isViewed) {
      this.newMessagesCount = Math.max(this.newMessagesCount - 1, 0);
    }
  }

  setFocus(id: number) {
    this.store.dispatch(setFocus({ id: '' + id }));
  }
}
