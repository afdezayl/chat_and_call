import { DatabasePoolService } from '@chat-and-call/utils/database-pool';
import { Injectable, Logger } from '@nestjs/common';
import { IChannelEntity } from '../models/channel.entity';

@Injectable()
export class ChannelsRepositoryService {
  constructor(private db: DatabasePoolService, private logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }
  async getChannels(user: string): Promise<Array<IChannelEntity>> {
    try {
      const [rows] = await this.db.pool.execute<Array<IChannelEntity>>(
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

      return rows;
    } catch (error) {
      this.logger.error(error);
    }
    return [];
  }
}
