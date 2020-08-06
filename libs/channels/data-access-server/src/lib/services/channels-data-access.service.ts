import { Injectable } from '@nestjs/common';
import { ChannelsRepositoryService } from './channels-repository.service';
import { Channel } from '@chat-and-call/channels/shared';

@Injectable()
export class ChannelsDataAccessService {
  constructor(private repository: ChannelsRepositoryService) {}

  async getChannels(user: string): Promise<Array<Channel>> {
    return (await this.repository.getChannels(user)).map((ch) => ({
      ...ch,
      id: ch.id.toString(),
      public: !!ch.public,
    }));
  }
}
