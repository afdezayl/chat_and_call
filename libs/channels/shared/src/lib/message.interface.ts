<<<<<<< HEAD
import { BasicMessage } from './basic-message.interface';

export interface Message extends BasicMessage {
  from: string;
=======
export interface Message {
  channel: string;
  from: string;
  text?: string;
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
  date: Date;
}
