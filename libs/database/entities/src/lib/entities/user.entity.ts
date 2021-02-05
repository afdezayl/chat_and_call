import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  login!: string;

  @Unique()
  @Property()
  mail!: string;

  @Property()
  password!: string;
}
