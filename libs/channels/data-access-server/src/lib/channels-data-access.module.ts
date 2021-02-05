import { ServerContactsModule } from '@chat-and-call/contacts/feature-server-contacts';
import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Access, Channel } from '@chat-and-call/database/entities';
import { ChannelsDataAccessService } from './services/channels-data-access.service';
import { ChannelsRepositoryService } from './services/channels-repository.service';

@Module({
  imports: [
    DatabasePoolModule,
    ServerContactsModule,
    MikroOrmModule.forFeature([Channel, Access]),
  ],
  providers: [ChannelsDataAccessService, ChannelsRepositoryService],
  exports: [ChannelsDataAccessService],
})
export class ChannelsDataAccessModule {}
