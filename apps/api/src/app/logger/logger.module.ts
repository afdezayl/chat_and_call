import { Module, ConsoleLogger, Global, Scope, Logger } from '@nestjs/common';

@Global()
@Module({
  providers: [{ useClass: ConsoleLogger, provide: ConsoleLogger, scope: Scope.TRANSIENT }],
  exports: [ConsoleLogger],
})
export class LoggerModule {}
