import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  loadChannels,
  setFocus,
  subscribeChannel,
  sendMessage,
} from '../+state/chat.actions';
import {
  getChannels,
  getFocusedChannel,
  getMessagesFromFocusChannel,
} from '../+state/chat.selectors';
import { tap, map, skipWhile } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BasicMessage } from 'libs/channels/shared/src/lib';

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
