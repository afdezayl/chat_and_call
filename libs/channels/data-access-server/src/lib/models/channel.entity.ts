import { RowDataPacket } from 'mysql2';

export interface IChannelEntity extends RowDataPacket {
  id: number;
  title: string;
  public: 0 | 1;
  admin: string;
}
