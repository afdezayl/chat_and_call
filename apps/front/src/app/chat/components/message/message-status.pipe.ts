import { Pipe, PipeTransform } from '@angular/core';
import { MessageStatus } from '../../+state/chat.reducer';

@Pipe({
  name: 'messageStatusIcon',
})
export class MessageStatusPipe implements PipeTransform {
  private iconNames = {
    [MessageStatus.Pending]: 'import_export',
    [MessageStatus.Server]: 'done',
    [MessageStatus.Target]: 'done_all',
    [MessageStatus.Read]: 'done_all',
    [MessageStatus.Error]: 'error',
  };
  transform(type: MessageStatus): string {
    return this.iconNames[type];
  }
}
