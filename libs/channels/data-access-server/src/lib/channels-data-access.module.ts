import { Module } from '@nestjs/common';
import { ChannelsDataAccessService } from './services/channels-data-access.service';
import { ChannelsRepositoryService } from './services/channels-repository.service';
import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';
import { ServerContactsModule } from '@chat-and-call/contacts/feature-server-contacts';

@Module({
  imports: [DatabasePoolModule, ServerContactsModule],
  providers: [ChannelsDataAccessService, ChannelsRepositoryService],
  exports: [ChannelsDataAccessService],
})
export class ChannelsDataAccessModule {}
