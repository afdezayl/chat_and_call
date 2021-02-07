import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Module({
  imports: [],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ServerContactsModule {}
