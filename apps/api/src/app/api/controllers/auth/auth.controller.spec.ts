import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {
  AuthService,
  AuthDataAccessModule,
} from '@chat-and-call/auth/data-access-auth-server';
import { DatabasePoolModule } from '@chat-and-call/utils/database-pool';
import { LoggerModule } from '../../../logger/logger.module';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [AuthDataAccessModule, DatabasePoolModule, LoggerModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
