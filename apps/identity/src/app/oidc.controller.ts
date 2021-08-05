import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OidcProviderService } from './oidc-provider.service';

@Controller('oidc')
export class OidcController {
  constructor(private readonly oidc: OidcProviderService) {}

  @All('/*')
  public mountedOidc(@Req() req: Request, @Res() res: Response): void {
    const url = req.originalUrl.replace(/^.*\/oidc/, '');
    req.url = url;
    return this.oidc.callback(req, res);
  }
}
