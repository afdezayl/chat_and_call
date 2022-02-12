import { AGServer } from 'socketcluster-server';
import {
  AGActionHandshakeSC,
  AGActionHandshakeWS
} from 'socketcluster-server/action';

export const MIDDLEWARE_HANDSHAKE_TOKEN = 'SOCKETCLUSTER_MIDDLEWARE_HANDSHAKE';

export abstract class MiddlewareHandshakeStrategy {
  /**
   * Allows to interact with native socketcluster server
   * @param server Socketcluster server instance
   */
  onServer?(server: AGServer): void | Promise<void>;

  onWSHandshake?(action: AGActionHandshakeWS): void | Promise<void>;

  onSCHandshake?(action: AGActionHandshakeSC): void | Promise<void>;

  default(
    action: AGActionHandshakeWS | AGActionHandshakeSC
  ): void | Promise<void> {
    action.allow();
  }
}
