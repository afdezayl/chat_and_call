import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel, ChannelType } from '@chat-and-call/channels/shared';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { sendFileInfoToServer, sendMessage } from '../../+state/chat.actions';
import { getFocusedChannel } from '../../+state/chat.selectors';

@Component({
  selector: 'chat-and-call-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageBarComponent implements AfterViewInit {
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;

  focus$ = this.store
    .select(getFocusedChannel)
    .pipe(tap(() => this.setInitialState()));

  channelTypes = ChannelType;
  messageForm: FormGroup = this.fb.group({
    text: this.fb.control('', Validators.required),
    file: this.fb.control(null),
  });

  constructor(private store: Store, private fb: FormBuilder) {}

  ngAfterViewInit(): void {
    this.setAutofocus();
  }

  sendMessage(idChannel: string) {
    const message = {
      text: this.messageForm.value.text,
      channel: idChannel,
    };
    this.messageForm.reset();

    this.store.dispatch(sendMessage({ message }));
  }

  sendFile(event: Event, focus: Channel) {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.length ? files[0] : null;

    if (file && focus) {
      this.store.dispatch(
        sendFileInfoToServer({
          to: focus.id,
          file,
        })
      );
    }
  }

  private setInitialState() {
    this.messageForm.reset();
    this.setAutofocus();
  }

  private setAutofocus() {
    this.textInput?.nativeElement?.focus();
  }
}
