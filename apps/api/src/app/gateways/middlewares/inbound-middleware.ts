import {
  AGAction,
  InvokeAction,
  MiddlewareInboundStrategy,
  PublishInAction,
  SubscribeAction,
  TransmitAction,
} from '@chat-and-call/socketcluster/adapter';
import { Injectable, Logger } from '@nestjs/common';
import { timeEnd } from 'console';

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
