import { Module } from '@nestjs/common';
import { ContactsFeatureServerContactsService } from './contacts-feature-server-contacts.service';

@Module({
  controllers: [],
  providers: [ContactsFeatureServerContactsService],
  exports: [ContactsFeatureServerContactsService],
})
export class ContactsFeatureServerContactsModule {}
