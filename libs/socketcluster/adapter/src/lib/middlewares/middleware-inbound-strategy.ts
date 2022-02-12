import {
  AGActionAuthenticate,
  AGActionInvoke,
  AGActionPublishIn,
  AGActionSubscribe,
  AGActionTransmit,
} from 'socketcluster-server/action';

export const MIDDLEWARE_INBOUND_TOKEN = 'SOCKETCLUSTER_MIDDLEWARE_INBOUND';

export abstract class MiddlewareInboundStrategy {
  /**
   * When server receives a transmit action
   * @param action
   */
  onTransmit?(action: AGActionTransmit): void | Promise<void>;

  /**
   * Invoke type
   * @param action
   */
  onInvoke?(action: AGActionInvoke): void | Promise<void>;

  /**
   * Publish_in type
   * @param action
   */
  onPublishIn?(action: AGActionPublishIn): void | Promise<void>;

  /**
   * Subscribe type
   * @param action
   */
  onSubscribe?(action: AGActionSubscribe): void | Promise<void>;

  /**
   * Authenticate
   * @param action
   */
  onAuthenticate?(action: AGActionAuthenticate): void | Promise<void>;

  /**
   * Default action when not specific implementation is provided
   * @param action
   */
  default(
    action:
      | AGActionTransmit
      | AGActionInvoke
      | AGActionSubscribe
      | AGActionPublishIn
      | AGActionAuthenticate
  ): void | Promise<void> {
    action.allow();
  }
}
