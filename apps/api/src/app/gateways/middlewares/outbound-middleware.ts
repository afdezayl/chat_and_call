import {
  MiddlewareOutboundStrategy,
  PublishOutAction,
} from '@chat-and-call/socketcluster/adapter';

export class OutboundStrategy extends MiddlewareOutboundStrategy {
  onPublishOut(action: PublishOutAction): void | Promise<void> {
    action.allow();
  }
}
