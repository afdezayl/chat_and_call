import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { oidc } from './oidc.provider';
const callback = oidc.callback();

@Controller('oidc')
export class OidcController {
  constructor() {
    console.log('created...')
  }
  @All('/*')
  public mountedOidc(@Req() req: Request, @Res() res: Response): void {
    const url = req.originalUrl.replace(/^.*\/oidc/, '');
    req.url = url;
    return callback(req, res);
  }
}
