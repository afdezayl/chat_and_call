import { Injectable, Logger } from '@nestjs/common';
import {
  MiddlewareInboundStrategy,
  AGAction,
  AuthenticateAction,
  InvokeAction,
  PublishInAction,
  TransmitAction,
  SubscribeAction,
} from '@chat-and-call/socketcluster/adapter';

@Injectable()
export class MockMiddleware extends MiddlewareInboundStrategy {
  constructor(private logger: Logger) {
    super();
    this.logger.setContext(this.constructor.name);
    this.logger.log('creating middleware...');
  }

  onInvoke?(action: InvokeAction) {
    this.logger.log('invoke - ' + action.procedure);
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
    this.logger.log('default middleware action - ' + action.type);
    action.allow();
  }

  onTransmit?(action: TransmitAction): void | Promise<void> {
    this.logger.log('transmit middleware', action.data);
    action.allow();
  }
}
