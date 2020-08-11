import { Test } from '@nestjs/testing';
import { ServerContactsService } from './server-contacts.service';

describe('ServerContactsService', () => {
  let service: ServerContactsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerContactsService],
    }).compile();

    service = module.get(ServerContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
