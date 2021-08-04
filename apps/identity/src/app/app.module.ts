import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { OidcController } from './oidc.controller';

@Module({
  imports: [],
  controllers: [OidcController],
  providers: [AppService],
})
export class AppModule {}
