import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { TranslocoModule } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ChatEffects } from './+state/chat.effects';
import * as fromChat from './+state/chat.reducer';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';
import { ChatRoutingModule } from './chat-routing.module';
import { ChannelCreatorComponent } from './components/channel-creator/channel-creator.component';
import { ChannelInfoComponent } from './components/channel-info/channel-info.component';
import { ChannelIconPipe } from './components/channel-selector/channel-icon.pipe';
import { ChannelSelectorComponent } from './components/channel-selector/channel-selector.component';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { MessageBarComponent } from './components/message-bar/message-bar.component';
import { MessageStatusPipe } from './components/message/message-status.pipe';
import { MessageComponent } from './components/message/message.component';
import { VideoCallComponent } from './components/video-call/video-call.component';
import { FileMessageComponent } from './components/file-message/file-message.component';

@NgModule({
  declarations: [
    ChatLayoutComponent,
    ChatHeaderComponent,
    MessageComponent,
    VideoCallComponent,
    ChannelSelectorComponent,
    MessageBarComponent,
    ChannelInfoComponent,
    MessageStatusPipe,
    ChannelIconPipe,
    ChannelCreatorComponent,
    FileMessageComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    StoreModule.forFeature(fromChat.chatFeatureKey, fromChat.reducer),
    TranslocoModule,
    EffectsModule.forFeature([ChatEffects]),
  ],
})
export class ChatModule {}
