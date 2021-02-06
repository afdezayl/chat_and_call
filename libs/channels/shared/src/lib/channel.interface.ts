import { Message } from './message.interface';

export interface Channel {
  id: string;
  title: string;
  admin: Array<string> | null;
  type: ChannelType;
}

export enum ChannelType {
  Public,
  Private,
  Personal,
}
