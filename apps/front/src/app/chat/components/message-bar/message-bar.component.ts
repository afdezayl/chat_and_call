import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicMessage, ChannelType } from '@chat-and-call/channels/shared';
import { Store } from '@ngrx/store';
import { sendMessage } from '../../+state/chat.actions';
import { getFocusedChannel } from '../../+state/chat.selectors';
import { ChatSocketService } from '../../services/chat-socket.service';

@Component({
  selector: 'chat-and-call-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss'],
})
export class MessageBarComponent {
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;

  focus$ = this.store.select(getFocusedChannel);

  channelTypes = ChannelType;
  messageForm: FormGroup = this.fb.group({
    text: this.fb.control('', Validators.required),
    file: this.fb.control(null),
  });

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private socket: ChatSocketService
  ) {}

  sendMessage(idChannel: string) {
    const message: BasicMessage = {
      text: this.messageForm.value.text,
      channel: idChannel,
    };
    this.messageForm.reset();

    this.store.dispatch(sendMessage({ message }));
  }

  async sendFile(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    const file = files ? files[0] : null;
    if (file) {
      const chunked = await this.socket.sendFile(file);

      console.log(chunked);
    }
  }

  setAutofocus() {
    this.textInput?.nativeElement?.focus();
  }
}
