import { Injectable } from '@nestjs/common';
import { ChannelsRepositoryService } from '../repository/channels-repository.service';

@Injectable()
export class ChannelsDataAccessService {
  constructor(private repository: ChannelsRepositoryService) {}

  async getChannels(user: string) {
    return (await this.repository.getChannels(user)).map((ch) => ({
      ...ch,
<<<<<<< HEAD
      id: ch.id.toString(),
=======
>>>>>>> 8eee2eb840a842b76c95f35ec7bd3f81803a7f11
      public: !!ch.public,
    }));
  }
}
