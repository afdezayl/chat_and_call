import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsRepositoryService } from './channels-repository.service';

describe('ChannelsRepositoryService', () => {
  let service: ChannelsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsRepositoryService],
    }).compile();

    service = module.get<ChannelsRepositoryService>(ChannelsRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
