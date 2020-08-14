import { HandshakeWSAction, HandshakeSCAction, AGAction } from '../interfaces';

export const MIDDLEWARE_HANDSHAKE_TOKEN = 'SOCKETCLUSTER_MIDDLEWARE_HANDSHAKE';

export abstract class MiddlewareHandshakeStrategy {
  onWSHandshake?(action: HandshakeWSAction): void | Promise<void>;

  onSCHandshake?(action: HandshakeSCAction): void | Promise<void>;

  default?(action: AGAction): void | Promise<void> {
    action.allow();
  }
}
