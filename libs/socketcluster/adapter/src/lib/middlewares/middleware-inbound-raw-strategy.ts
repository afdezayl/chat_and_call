import { AGActionMessage } from 'socketcluster-server/action';

export const MIDDLEWARE_INBOUND_RAW_TOKEN =
  'SOCKETCLUSTER_MIDDLEWARE_INBOUND_RAW';

export abstract class MiddlewareInboundRawStrategy {
  /**
   * When server receives a transmit action
   * @param action
   */
  abstract onMessage(action: AGActionMessage): void | Promise<void>;
}
