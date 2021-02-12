import {
  MessageAction,
  MiddlewareInboundRawStrategy,
} from '@chat-and-call/socketcluster/adapter';
import { Injectable } from '@nestjs/common';
@Injectable()
export class RawStrategy extends MiddlewareInboundRawStrategy {
  onMessage(action: MessageAction): void | Promise<void> {
    action.allow();
  }
}
