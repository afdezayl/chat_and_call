import { Message } from 'protobufjs';
import { SCPublishEvent, StrictAny } from '../dto';
import { SCCodecEventHandler } from './codec-handle.interface';
import { decodeStrictAny, encodeInnerData } from './utils';

export const publishHandler: SCCodecEventHandler = {
  event: '#publish',
  encode: (object: PublishContent) => {
    if (!(object.data.data instanceof Message)) {
      throw new Error('Pass a Message instance to the publish method');
    }
    const newData = encodeInnerData(object.data);

    const publish: PublishContent = {
      event: '#publish',
      data: newData,
    };

    const verifyErrors = SCPublishEvent.verify(publish);
    if (verifyErrors) {
      throw new Error(verifyErrors);
    }

    return SCPublishEvent.encode(publish).finish();
  },

  decode: (buffer: Uint8Array): PublishContent | null => {
    try {
      const decoded = SCPublishEvent.decode(buffer);
      let innerData = decodeStrictAny(decoded.data.data);

      return {
        event: decoded.event,
        data: {
          channel: decoded.data.channel,
          data: innerData,
        },
      };
    } catch (err) {
      return null;
    }
  },
};

export interface PublishContent {
  event: '#publish';
  data: {
    channel: string;
    data: any;
  };
}
