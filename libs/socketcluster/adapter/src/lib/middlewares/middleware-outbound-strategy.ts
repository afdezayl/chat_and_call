import { PublishOutAction } from '../interfaces';

export const MIDDLEWARE_OUTBOUND_TOKEN = 'SOCKETCLUSTER_MIDDLEWARE_OUTBOUND';

export abstract class MiddlewareOutboundStrategy {
  abstract onPublishOut(action: PublishOutAction): void | Promise<void>;
}
