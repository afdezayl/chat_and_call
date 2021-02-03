import {
  AGAction,
  TransmitAction,
  InvokeAction,
  PublishInAction,
  SubscribeAction,
  AuthenticateAction,
} from '../interfaces';

export const MIDDLEWARE_INBOUND_TOKEN = 'SOCKETCLUSTER_MIDDLEWARE_INBOUND';

export abstract class MiddlewareInboundStrategy {
  /**
   * When server receives a transmit action
   * @param action
   */
  onTransmit?(action: TransmitAction): void | Promise<void>;

  /**
   * Invoke type
   * @param action
   */
  onInvoke?(action: InvokeAction): void | Promise<void>;

  /**
   * Publish_in type
   * @param action
   */
  onPublishIn?(action: PublishInAction): void | Promise<void>;

  /**
   * Subscribe type
   * @param action
   */
  onSubscribe?(action: SubscribeAction): void | Promise<void>;

  /**
   * Authenticate
   * @param action
   */
  onAuthenticate?(action: AuthenticateAction): void | Promise<void>;

  /**
   * Default action when not specific implementation is provided
   * @param action
   */
  default(action: AGAction): void | Promise<void> {
    action.allow();
  }
}
