import { Injectable, Logger } from '@nestjs/common';
import { DatabasePoolService } from '@chat-and-call/utils/database-pool';
import { FriendsDupleEntity } from './friends-duple.entity';

@Injectable()
export class ContactsRepository {
  constructor(private db: DatabasePoolService, private logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  async getContactsFromUser(user: string): Promise<Array<FriendsDupleEntity>> {
    try {
      const [rows] = await this.db.pool.execute<Array<FriendsDupleEntity>>(
        `
        SELECT login1, login2
        FROM friends
        WHERE login1=?
          OR login2=?
        `,
        [user, user]
      );

      return rows;
    } catch (err) {
      this.logger.error(err);
    }

    return [];
  }
}
