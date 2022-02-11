import { Module, ConsoleLogger, Global, Scope, Logger } from '@nestjs/common';

@Global()
@Module({
  providers: [{ useClass: ConsoleLogger, provide: Logger, scope: Scope.TRANSIENT }],
  exports: [Logger],
})
export class LoggerModule {}
