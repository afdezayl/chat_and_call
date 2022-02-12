import { MiddlewareOutboundStrategy } from '@chat-and-call/socketcluster/adapter';
import { AGActionPublishOut } from 'socketcluster-server/action';

export class OutboundStrategy extends MiddlewareOutboundStrategy {
  onPublishOut(action: AGActionPublishOut): void | Promise<void> {
    action.allow();
  }
}
