import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
<<<<<<< HEAD
  ChangeDetectionStrategy,
=======
  Renderer2,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  loadChannels,
  setFocus,
  subscribeChannel,
<<<<<<< HEAD
  sendMessage,
=======
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
} from '../+state/chat.actions';
import {
  getChannels,
  getFocusedChannel,
<<<<<<< HEAD
  getMessagesFromFocusChannel,
} from '../+state/chat.selectors';
import { tap, map, skipWhile } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BasicMessage } from '@chat-and-call/channels/shared';
=======
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
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11

@Component({
  selector: 'chat-and-call-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatLayoutComponent implements OnInit {
<<<<<<< HEAD
  messageForm: FormGroup;
=======
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
  // TODO: separate on components
  // channels-container
  channels$ = this.store.select(getChannels);
  focus$ = this.store.select(getFocusedChannel);

  // messageContainer
  unreaded$ = new BehaviorSubject<number>(0);

  newMessagesCount = 0;
  messages$ = this.store.select(getMessagesFromFocusChannel).pipe(
    skipWhile((x) => x.length === 0),
<<<<<<< HEAD
    map((x) => x.slice(-20)),
    tap(() => {
      this.newMessagesCount++;
    })
=======
    map( x => x.slice(-20)),
    tap((x) => {
      this.newMessagesCount++;
    }),

>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
  );

  @ViewChild('message_container') messageContainer: ElementRef<HTMLDivElement>;

<<<<<<< HEAD
  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.store.dispatch(loadChannels());
    this.messageForm = this.fb.group({
      text: this.fb.control('', Validators.required),
      file: this.fb.control(null),
    });
=======
  constructor(private store: Store, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store.dispatch(loadChannels());
    this.store.dispatch(subscribeChannel({ channel: '1' }));
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
  }

  onViewed(isViewed: boolean) {
    if (isViewed) {
      this.newMessagesCount = Math.max(this.newMessagesCount - 1, 0);
    }
  }

  setFocus(id: number) {
    this.store.dispatch(setFocus({ id: '' + id }));
  }
<<<<<<< HEAD

  sendMessage(idChannel: string) {
    const message: BasicMessage = {
      text: this.messageForm.value.text,
      channel: idChannel,
    };
    this.store.dispatch(sendMessage({ message }));
  }
=======
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
}
