import {
  Text,
  SCPublishEvent,
  StrictAny,
  SCEvent,
  SCPublishData,
} from '../dto';
import { publishHandler } from './publish-handler';

const message = 'hello world';
const textdata = new Text({ text: message });
const internalData = new StrictAny({
  type_url: Text.$type.name,
  value: Text.encode(textdata).finish(),
});
const validPublishEvent = {
  event: '#publish',
  data: {
    channel: 'channel',
    data: internalData,
  },
};

test('valid publish event encode', () => {
  const verifyErrors = SCPublishEvent.verify(validPublishEvent);

  expect(verifyErrors).toBe(null);

  const encoded = SCPublishEvent.encode(validPublishEvent).finish();

  const input = {
    event: '#publish',
    data: {
      channel: 'channel',
      data: textdata,
    },
  };

  const result = publishHandler.encode(input);

  expect(encoded).toEqual(result);
});

test('invalid publish event decode', () => {
  const publishEvent = {
    event: '#publish',
    data: {
      channel: 'channel',
      data: { error: 'error' },
    },
  };

  const fn = () => publishHandler.encode(publishEvent);

  expect(() => {
    fn();
  }).toThrow('Pass a Message instance to the publish method');
});

test('decode valid buffer and avoid mutation', () => {
  const encoded = SCPublishEvent.encode(validPublishEvent).finish();
  const result = publishHandler.decode(encoded);

  expect(result.data.data.text).toBe(message);

  const obj = {
    event: '#publish',
    data: {
      channel: 'channel',
      data: textdata,
    },
  };
  const enc2 = publishHandler.encode(obj);
  const result2 = publishHandler.decode(enc2 as Uint8Array);

  expect(result2.data.data.text).toBe(message);

  const enc3 = publishHandler.encode(obj);
  const result3 = publishHandler.decode(enc3 as Uint8Array);

  expect(result3.data.data.text).toBe(message);
});

test('decode invalid buffer', () => {
  const encoded = Text.encode(textdata).finish();
  const result = publishHandler.decode(encoded);

  expect(result).toBe(null);
});

test('scevent decode', () => {
  const encoded = SCPublishEvent.encode(validPublishEvent).finish();
  const result = SCEvent.decode(encoded);

  expect(result.event).toBe(validPublishEvent.event);
});
