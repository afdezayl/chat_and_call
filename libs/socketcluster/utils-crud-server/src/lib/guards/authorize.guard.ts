import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { SocketCrudRequest } from '../utils/method-decorators-utils';
import { AGServerSocket } from 'socketcluster-server';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const wsContext = context.switchToWs();
    const socket = wsContext.getClient() as AGServerSocket;
    const request = wsContext.getData() as SocketCrudRequest;

    if (socket.authState === socket.AUTHENTICATED) {
      return true;
    }

    request.error('Unauthorized');
    return false;
  }
}
