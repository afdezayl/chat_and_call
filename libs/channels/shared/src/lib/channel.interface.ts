import { Message } from './message.interface';

export interface Channel {
  id: string;
  title: string;
  admin?: string;
  public: boolean;
}
