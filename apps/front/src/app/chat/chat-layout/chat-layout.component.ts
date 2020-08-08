import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicMessage } from '@chat-and-call/channels/shared';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { map, skipWhile, tap } from 'rxjs/operators';
import { loadChannels, sendMessage, setFocus } from '../+state/chat.actions';
import {
  getChannels,
  getFocusedChannel,
  getMessagesFromFocusChannel,
} from '../+state/chat.selectors';

@Component({
  selector: 'chat-and-call-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatLayoutComponent implements OnInit {
  messageForm: FormGroup;
  // TODO: separate on components
  // channels-container
  channels$ = this.store.select(getChannels);
  focus$ = this.store.select(getFocusedChannel);

  // messageContainer
  unreaded$ = new BehaviorSubject<number>(0);

  newMessagesCount = 0;
  messages$ = this.store.select(getMessagesFromFocusChannel).pipe(
    skipWhile((x) => x.length === 0),
    map((x) => x.slice(-20)),
    tap(() => {
      this.newMessagesCount++;
    })
  );

  @ViewChild('message_container') messageContainer: ElementRef<HTMLDivElement>;

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.store.dispatch(loadChannels());
    this.messageForm = this.fb.group({
      text: this.fb.control('', Validators.required),
      file: this.fb.control(null),
    });

    this.focus$.subscribe(console.log);
  }

  onViewed(isViewed: boolean) {
    if (isViewed) {
      this.newMessagesCount = Math.max(this.newMessagesCount - 1, 0);
    }
  }

  setFocus(id: number) {
    this.store.dispatch(setFocus({ id: '' + id }));
  }

  sendMessage(idChannel: string) {
    const message: BasicMessage = {
      text: this.messageForm.value.text,
      channel: idChannel,
    };
    this.store.dispatch(sendMessage({ message }));
  }
}
