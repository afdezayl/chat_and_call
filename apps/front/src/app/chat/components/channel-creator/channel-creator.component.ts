import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ChannelType } from 'libs/channels/shared/src/lib';
import { createChannel } from '../../+state/chat.actions';

@Component({
  selector: 'chat-and-call-channel-creator',
  templateUrl: './channel-creator.component.html',
  styleUrls: ['./channel-creator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelCreatorComponent implements OnInit {
  channelTypes = ChannelType;
  form = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.maxLength(35)]),
    type: this.fb.control(ChannelType.Private, [Validators.required]),
  });

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit() {
    const value = this.form.value;
    this.store.dispatch(createChannel({ channel: value }));
  }
}
