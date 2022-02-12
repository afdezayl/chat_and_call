import { MiddlewareInboundRawStrategy } from '@chat-and-call/socketcluster/adapter';
import { Injectable } from '@nestjs/common';
import { AGActionMessage } from 'socketcluster-server/action';
@Injectable()
export class RawStrategy extends MiddlewareInboundRawStrategy {
  onMessage(action: AGActionMessage): void | Promise<void> {
    action.allow();
  }
}
