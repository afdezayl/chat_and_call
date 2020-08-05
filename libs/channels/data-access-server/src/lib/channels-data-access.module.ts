import { Module } from '@nestjs/common';
import { ChannelsDataAccessService } from './services/channels-data-access.service';
import { ChannelsRepositoryService } from './repository/channels-repository.service';
import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';

@Module({
  imports: [DatabasePoolModule],
  providers: [ChannelsDataAccessService, ChannelsRepositoryService],
  exports: [ChannelsDataAccessService],
})
export class ChannelsDataAccessModule {}
