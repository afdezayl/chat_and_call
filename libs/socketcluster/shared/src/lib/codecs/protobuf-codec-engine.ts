import { Message, roots, Type } from 'protobufjs';
import { AGServer } from 'socketcluster-server';
import { SCDefaultFormatter } from './sc-default-formatter';
import { SCEvent, SCEventResponse, SCInvoke, StrictAny } from '../dto';
import { publishHandler } from './publish-handler';
import { authTokenHandler } from './auth-token-handler';
import { SCCodecEventHandler } from './codec-handle.interface';
import { decodeStrictAny, encodeInnerData } from './utils';

export class ProtobufCodecEngine implements AGServer.CodecEngine {
  private codecHandlers: Array<SCCodecEventHandler> = [
    publishHandler,
    authTokenHandler,
  ];
  private pingPongMessages = ['', '#1', '#2'];
  private debugMode: boolean;

  private defaultCodec = new SCDefaultFormatter();

  private readonly isBrowser =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';
  private readonly isNode =
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;

  constructor(options?: {
    /**
     * Shows encode errors and not protobuf objects
     */
    debug?: boolean;
  }) {
    this.debugMode = options?.debug ?? false;
  }
  encode(object: any) {
    if (this.pingPongMessages.includes(object)) {
      return object;
    }
    try {
      if (this.codecHandlers.some((h) => h.event === object.event)) {
        const handler = this.codecHandlers.find(
          (h) => h.event === object.event
        );

        if (handler) {
          return handler.encode({ ...object });
        }
      }

      if (this.isEvent(object)) {
        const output = encodeInnerData(object);
        const errors = SCInvoke.verify(output);
        if (!errors) {
          return SCInvoke.encode(output).finish();
        }
      }

      if (this.isResponse(object)) {
        const output = encodeInnerData(object);
        const errors = SCEventResponse.verify(output);
        if (!errors) {
          return SCEventResponse.encode(output).finish();
        }
      }
    } catch (error) {
      if (this.debugMode) {
        console.error('Encode error', error);
      }
    }

    return this.defaultCodec.encode(object);
  }

  decode(input: any) {
    let buffer: null | Uint8Array = null;

    if (this.isBrowser && input instanceof ArrayBuffer) {
      buffer = new Uint8Array(input);
    } else if (this.isNode && input instanceof Buffer) {
      buffer = input;
    }

    if (buffer) {
      const event = this._decodeScEvent(buffer);
      const handler = this.codecHandlers.find((h) => h.event === event?.event);
      if (handler) {
        return handler.decode(buffer);
      }

      const invoke = this._decodeScInvoke(buffer);
      if (invoke) {
        if (invoke?.data) {
          return { ...invoke, data: decodeStrictAny(invoke.data) };
        }

        return invoke;
      }

      const response = this._decodeScResponse(buffer);
      if (response) {
        if (response?.data) {
          return { ...response, data: decodeStrictAny(response.data) };
        }

        return invoke;
      }
    }

    if (this.debugMode) {
      console.log('not protobuf', input);
    }
    return this.defaultCodec.decode(input);
  }

  private isEvent(object: any) {
    return Reflect.has(object, 'event');
  }
  private isResponse(object: any) {
    return Reflect.has(object, 'rid');
  }

  private _decodeScEvent(buffer: Uint8Array) {
    try {
      return SCEvent.decode(buffer);
    } catch (error) {
      return null;
    }
  }

  private _decodeScInvoke(buffer: Uint8Array) {
    try {
      return SCInvoke.decode(buffer);
    } catch (error) {
      return null;
    }
  }

  private _decodeScResponse(buffer: Uint8Array) {
    try {
      return SCEventResponse.decode(buffer);
    } catch (error) {
      return null;
    }
  }
}
