import { AuthService } from '@chat-and-call/auth/data-access-auth-server';
import { ChannelsDataAccessService } from '@chat-and-call/channels/data-access-server';
import {
  AGAction,
  AuthenticateAction,
  MiddlewareInboundStrategy,
  PublishInAction,
  SubscribeAction,
} from '@chat-and-call/socketcluster/adapter';
import { Injectable, Logger } from '@nestjs/common';
import { CookieUtil } from './cookie-util';

@Injectable()
export class InboundStrategy extends MiddlewareInboundStrategy {
  constructor(
    private logger: Logger,
    private channelsService: ChannelsDataAccessService,
    private cookie: CookieUtil,
    private authService: AuthService
  ) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  onPublishIn?(action: PublishInAction): void {
    action.block(new Error('Unauthorized'));
  }

  async onSubscribe?(action: SubscribeAction): Promise<void> {
    const user = action.socket?.authToken?.username ?? null;
    let channel = action.channel;

    if (channel.endsWith('/ack')) {
      channel = channel.replace('/ack', '');
    }
    if (channel.endsWith('/file')) {
      channel = channel.replace('/file', '');
    }
    if (channel.endsWith('/file_info')) {
      channel = channel.replace('/file_info', '');
    }

    if (
      channel === user ||
      (await this.channelsService.checkChannelAccess(user, channel).catch(console.error))
    ) {
      //this.logger.log(user + ' subscribe -> ' + action.channel);
      action.allow();
    } else {
      action.block(new Error('Unauthorized'));
    }
  }

  default(action: AGAction): void | Promise<void> {
    //this.logger.debug('default middleware action - ' + action.type);
    action.allow();
  }

  async onAuthenticate?(action: AuthenticateAction): Promise<void> {
    const { socket, authToken } = action;
    const username = authToken?.username;

    const refreshToken =
      this.cookie.getRefreshTokenFromRequest(socket.request) ?? '';
    const refreshContent = await this.authService.validateToken(refreshToken);
    const refreshUser = refreshContent?.username;

    // Avoid use of tokens from other users
    if (!username || !refreshUser || username !== refreshUser) {
      this.logger.error(`Invalid access ${username} - ${refreshUser}`);
      action.block(new Error('Invalid tokens'));
      socket.disconnect();
      return;
    }

    action.allow();
  }
}
