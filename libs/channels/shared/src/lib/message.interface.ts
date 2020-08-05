import { BasicMessage } from './basic-message.interface';

export interface Message extends BasicMessage {
  from: string;
  date: Date;
}
