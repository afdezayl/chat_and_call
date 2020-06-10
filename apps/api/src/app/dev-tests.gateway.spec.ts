import { Test, TestingModule } from '@nestjs/testing';
import { DevTestsGateway } from './dev-tests.gateway';

describe('DevTestsGateway', () => {
  let gateway: DevTestsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevTestsGateway],
    }).compile();

    gateway = module.get<DevTestsGateway>(DevTestsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
