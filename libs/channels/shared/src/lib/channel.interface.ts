import { Message } from './message.interface';

export interface Channel {
  id: string;
  title: string;
  admin?: string;
  type: ChannelType;
}

export enum ChannelType {
  Public,
  Private,
  Personal,
}
