import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { StoreModule } from '@ngrx/store';
import * as fromChat from './+state/chat.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ChatEffects } from './+state/chat.effects';
import { MessageComponent } from './components/message/message.component';
import { VideoCallComponent } from './components/video-call/video-call.component';


@NgModule({
  declarations: [ChatLayoutComponent, ChatHeaderComponent, MessageComponent, VideoCallComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    StoreModule.forFeature(fromChat.chatFeatureKey, fromChat.reducer),
    EffectsModule.forFeature([ChatEffects])
  ]
})
export class ChatModule { }
