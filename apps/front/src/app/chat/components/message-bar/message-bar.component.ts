import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicMessage } from '@chat-and-call/channels/shared';
import { Store } from '@ngrx/store';
import { sendMessage } from '../../+state/chat.actions';
import { getFocusedChannel } from '../../+state/chat.selectors';

@Component({
  selector: 'chat-and-call-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss'],
})
export class MessageBarComponent implements OnInit {
  focus$ = this.store.select(getFocusedChannel);
  messageForm: FormGroup;

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      text: this.fb.control('', Validators.required),
      file: this.fb.control(null),
    });
  }

  sendMessage(idChannel: string) {
    const message: BasicMessage = {
      text: this.messageForm.value.text,
      channel: idChannel,
    };
    this.messageForm.reset();

    this.store.dispatch(sendMessage({ message }));
  }
}
