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
  File,
  FileInfo,
  Hidden,
}

export const visibleChannelsTypes = [
  ChannelType.Personal,
  ChannelType.Private,
  ChannelType.Public,
];
