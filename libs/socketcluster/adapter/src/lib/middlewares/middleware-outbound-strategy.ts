import { AGActionPublishOut } from 'socketcluster-server/action';

export const MIDDLEWARE_OUTBOUND_TOKEN = 'SOCKETCLUSTER_MIDDLEWARE_OUTBOUND';

export abstract class MiddlewareOutboundStrategy {
  abstract onPublishOut(action: AGActionPublishOut): void | Promise<void>;
}
