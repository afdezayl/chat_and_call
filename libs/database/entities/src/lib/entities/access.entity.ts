import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
export class Access {
  @ManyToOne(() => User, { primary: true, fieldName: 'login' })
  login!: string;

  @ManyToOne(() => Channel, { primary: true, fieldName: 'id_channel' })
  channel!: IdentifiedReference<Channel>;

  @Property()
  admin!: boolean;

  [PrimaryKeyType]: [string, number];
}
