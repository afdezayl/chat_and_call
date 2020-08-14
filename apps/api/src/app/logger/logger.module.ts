import { Module, Logger, Global, Scope } from '@nestjs/common';

@Global()
@Module({
  providers: [{ useClass: Logger, provide: Logger, scope: Scope.TRANSIENT }],
  exports: [Logger],
})
export class LoggerModule {}
