import { Module, Logger } from '@nestjs/common';
import { DatabasePoolService } from './database-pool.service';

@Module({
  controllers: [],
  providers: [DatabasePoolService],
  exports: [DatabasePoolService],
})
export class DatabasePoolModule {}
