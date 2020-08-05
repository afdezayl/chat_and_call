import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsGateway } from './channels.gateway';

describe('ChannelsGateway', () => {
  let gateway: ChannelsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsGateway],
    }).compile();

    gateway = module.get<ChannelsGateway>(ChannelsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
