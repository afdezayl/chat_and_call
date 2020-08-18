import { Injectable, Logger } from '@nestjs/common';
import {
  MiddlewareInboundStrategy,
  AGAction,
  AuthenticateAction,
  InvokeAction,
  PublishInAction,
  TransmitAction,
  SubscribeAction,
  SocketClusterAdapter,
} from '@chat-and-call/socketcluster/adapter';

@Injectable()
export class InboundStrategy extends MiddlewareInboundStrategy {
  constructor(private logger: Logger) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  onInvoke?(action: InvokeAction) {
    action.allow();
  }

  onPublishIn?(action: PublishInAction): void | Promise<void> {
    this.logger.log('publishIn middleware' + JSON.stringify(action.data));
    action.allow();
  }

  onSubscribe?(action: SubscribeAction): void | Promise<void> {
    this.logger.log('subscribe -> ' + action.channel);
    action.allow();
  }

  default(action: AGAction): void | Promise<void> {
    this.logger.debug('default middleware action - ' + action.type);
    action.allow();
  }

  onTransmit?(action: TransmitAction): void | Promise<void> {
    this.logger.log('transmit middleware', action.data);
    action.allow();
  }
}
