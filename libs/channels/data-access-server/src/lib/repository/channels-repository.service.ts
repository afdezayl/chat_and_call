import { Injectable, Logger } from '@nestjs/common';
import { DatabasePoolService } from '@chat-and-call/utils/database-pool';
import { Channel } from '@chat-and-call/channels/shared'

@Injectable()
export class ChannelsRepositoryService {
  constructor(private db: DatabasePoolService, private logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }
  async getChannels(user: string): Promise<Array<Channel>> {
    try {
      const [rows, fields] = await this.db.pool.execute(
        `
        SELECT ch.id, ch.title, ch.public, ch.admin
        FROM channels ch
        INNER JOIN access a ON ch.id = a.id_channel
        WHERE a.login = ?
      UNION
        SELECT ch.id, ch.title, ch.public, ch.admin
        FROM channels ch
        WHERE ch.public = 1
      ORDER BY id`,
        [user]
      );

      return rows as Array<Channel>;
    } catch (error) {
      this.logger.error(error);
    }
    return [];
  }
}
