import { Test } from '@nestjs/testing';
import { ChannelsDataAccessService } from './channels-data-access.service';

describe('ChannelsServerChannelsDataAccessService', () => {
  let service: ChannelsDataAccessService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ChannelsDataAccessService],
    }).compile();

    service = module.get(ChannelsDataAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
