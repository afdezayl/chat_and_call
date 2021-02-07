import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  login!: string;

  @Unique()
  @Property()
  mail!: string;

  @Property()
  password!: string;

  @ManyToMany({
    entity: () => User,
    pivotTable: 'friends',
    joinColumns: ['login1'],
    inverseJoinColumns: ['login2'],
  })
  friends!: Collection<User>;
}
