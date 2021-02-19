import { AuthDataAccessModule } from '@chat-and-call/auth/data-access-auth-server';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../../../logger/logger.module';
import { AuthController } from './auth.controller';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [AuthDataAccessModule, LoggerModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
