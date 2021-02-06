import { Pipe, PipeTransform } from '@angular/core';
import { ChannelType } from '@chat-and-call/channels/shared';

@Pipe({
  name: 'channelIcon',
})
export class ChannelIconPipe implements PipeTransform {
  private iconNames = {
    [ChannelType.Public]: 'article',
    [ChannelType.Private]: 'group',
    [ChannelType.Personal]: 'person',
  };
  transform(type: ChannelType): string {
    return this.iconNames[type];
  }
}
