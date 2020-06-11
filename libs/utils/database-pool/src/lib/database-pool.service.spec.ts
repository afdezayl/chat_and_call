import { Test } from '@nestjs/testing';
import { DatabasePoolService } from './database-pool.service';

describe('UtilsDatabasePoolService', () => {
  let service: DatabasePoolService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DatabasePoolService],
    }).compile();

    service = module.get(DatabasePoolService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
