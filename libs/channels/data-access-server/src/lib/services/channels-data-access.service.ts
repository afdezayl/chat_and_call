import { Injectable } from '@nestjs/common';
import { ChannelsRepositoryService } from '../repository/channels-repository.service';

@Injectable()
export class ChannelsDataAccessService {
  constructor(private repository: ChannelsRepositoryService) {}

  async getChannels(user: string) {
    return (await this.repository.getChannels(user)).map((ch) => ({
      ...ch,
      id: ch.id.toString(),
      public: !!ch.public,
    }));
  }
}
