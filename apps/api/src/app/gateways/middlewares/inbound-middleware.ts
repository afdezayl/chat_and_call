import {
  AGAction,
  InvokeAction,
  MiddlewareInboundStrategy,
  PublishInAction,
  SubscribeAction,
  TransmitAction,
} from '@chat-and-call/socketcluster/adapter';
import { ChannelsDataAccessService } from '@chat-and-call/channels/data-access-server';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InboundStrategy extends MiddlewareInboundStrategy {
  constructor(
    private logger: Logger,
    private channelsService: ChannelsDataAccessService
  ) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  onInvoke?(action: InvokeAction) {
    action.allow();
  }

  onPublishIn?(action: PublishInAction): void {
    action.block(new Error('Unauthorized'));
  }

  async onSubscribe?(action: SubscribeAction): Promise<void> {
    const user = action.socket?.authToken?.username ?? null;
    if (await this.channelsService.checkChannelAccess(user, action.channel)) {
      //this.logger.log(user + ' subscribe -> ' + action.channel);
      action.allow();
    } else {
      action.block(new Error('Unauthorized'));
    }
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
