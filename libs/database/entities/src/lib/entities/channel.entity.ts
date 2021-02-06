import {
  BigIntType,
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { RowDataPacket } from 'mysql2';
import { UuidBinaryType } from '../types/';
export interface IChannelEntity extends RowDataPacket {
  id: string;
  title: string;
  public: 0 | 1;
}

@Entity({ tableName: 'channels' })
export class Channel {
  @PrimaryKey({ type: BigIntType })
  id!: string;
  @Property()
  title!: string;
  @Property()
  public!: boolean;
  @Property({ type: UuidBinaryType })
  uuid!: string;

  constructor() {
    this.uuid = UuidBinaryType.createUuuid();
    console.log('creating channel', this);
  }
}
