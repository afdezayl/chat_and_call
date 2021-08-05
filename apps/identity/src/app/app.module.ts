import { Module } from '@nestjs/common';
import { OidcProviderService } from './oidc-provider.service';
import { OidcController } from './oidc.controller';

@Module({
  imports: [],
  controllers: [OidcController],
  providers: [OidcProviderService],
})
export class AppModule {}
