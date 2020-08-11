import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';
import { Module } from '@nestjs/common';
import { ContactsRepository } from './contacts-repository.service';
import { ServerContactsService } from './server-contacts.service';

@Module({
  imports: [DatabasePoolModule],
  providers: [ServerContactsService, ContactsRepository],
  exports: [ServerContactsService, ContactsRepository],
})
export class ServerContactsModule {}
