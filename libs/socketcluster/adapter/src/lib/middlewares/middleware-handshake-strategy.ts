import { HandshakeWSAction, HandshakeSCAction, AGAction } from '../interfaces';
import { AGServer } from 'socketcluster-server';

export const MIDDLEWARE_HANDSHAKE_TOKEN = 'SOCKETCLUSTER_MIDDLEWARE_HANDSHAKE';

export abstract class MiddlewareHandshakeStrategy {
  /**
   * Allows to interact with native socketcluster server
   * @param server Socketcluster server instance
   */
  onServer?(server: AGServer): void | Promise<void>;

  onWSHandshake?(action: HandshakeWSAction): void | Promise<void>;

  onSCHandshake?(action: HandshakeSCAction): void | Promise<void>;

  default?(action: AGAction): void | Promise<void> {
    action.allow();
  }
}
