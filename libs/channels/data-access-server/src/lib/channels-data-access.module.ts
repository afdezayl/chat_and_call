import { Access, Channel } from '@chat-and-call/database/entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ChannelsDataAccessService } from './services/channels-data-access.service';

@Module({
  imports: [MikroOrmModule.forFeature([Channel, Access])],
  providers: [ChannelsDataAccessService],
  exports: [ChannelsDataAccessService],
})
export class ChannelsDataAccessModule {}
