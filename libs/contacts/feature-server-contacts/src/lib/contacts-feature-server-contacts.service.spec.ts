import { Test } from '@nestjs/testing';
import { ContactsFeatureServerContactsService } from './contacts-feature-server-contacts.service';

describe('ContactsFeatureServerContactsService', () => {
  let service: ContactsFeatureServerContactsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ContactsFeatureServerContactsService],
    }).compile();

    service = module.get(ContactsFeatureServerContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
