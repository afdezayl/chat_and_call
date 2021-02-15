import { Message, roots, Type } from 'protobufjs';
import { AGServer } from 'socketcluster-server';
import { SCDefaultFormatter } from './sc-default-formatter';
import { SCEvent, SCEventResponse, StrictAny } from '../dto';

export class ProtobufCodecEngine implements AGServer.CodecEngine {
  private defaultCodec = new SCDefaultFormatter();
  readonly isBrowser =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';
  readonly isNode =
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;

  encode(object: any) {
    if (object?.data instanceof Message) {
      const message = object.data as Message;
      const encoded = message.$type.encode(message).finish();
      const newData = StrictAny.create({
        type_url: message.$type.name,
        value: encoded,
      });
      object.data = newData;
    }

    const verifyErrors = SCEvent.verify(object);
    if (verifyErrors === null) {
      const scEvent = SCEvent.create(object);
      return SCEvent.encode(scEvent).finish();
    }

    const responseErrors = SCEventResponse.verify(object);
    if (responseErrors === null) {
      const scResponse = SCEventResponse.create(object);
      return SCEventResponse.encode(scResponse).finish();
    }

    return this.defaultCodec.encode(object);
  }

  decode(input: any) {
    let buffer: null | Uint8Array = null;
    let output;
    if (this.isBrowser && input instanceof ArrayBuffer) {
      buffer = new Uint8Array(input);
    } else if (this.isNode && input instanceof Buffer) {
      buffer = input;
    }
    if (buffer) {
      const event = this._decodeScEvent(buffer);
      if (event) {
        output = event;
      }
      if (event?.data) {
        output = { ...event, data: this._decodeInnerData(event.data) };
      }

      const response = this._decodeScResponse(buffer);
      if (response) {
        output = response;
      }
      if (response?.data) {
        output = { ...response, data: this._decodeInnerData(response.data) };
      }
    }

    return output ? output : this.defaultCodec.decode(input);
  }

  private _decodeScEvent(buffer: Uint8Array) {
    try {
      return SCEvent.decode(buffer);
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

  private _decodeInnerData(innerData: StrictAny) {
    const type = (roots['decorated'].lookup(
      innerData.type_url
    ) as unknown) as Type | null;
    const decodedData = type?.decode(innerData.value);

    return decodedData;
  }
}
