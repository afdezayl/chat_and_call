import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { RowDataPacket } from 'mysql2';
export interface IChannelEntity extends RowDataPacket {
  id: number;
  title: string;
  public: 0 | 1;
}

@Entity({ tableName: 'channels' })
export class Channel {
  @PrimaryKey()
  id!: number;
  @Property()
  title!: string;
  @Property()
  public!: boolean;
}
