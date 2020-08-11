import { RowDataPacket } from 'mysql2';

export interface FriendsDupleEntity extends RowDataPacket {
  login1: string;
  login2: string;
}
