import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AGServerSocket } from 'socketcluster-server';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const wsContext = context.switchToWs();
    const socket = wsContext.getClient() as AGServerSocket;

    if (socket.authState === socket.AUTHENTICATED) {
      return true;
    }

    throw new WsException('Unauthorized');
    return false;
  }
}
