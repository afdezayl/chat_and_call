import { Message, roots, Type } from 'protobufjs';
import { StrictAny } from '../dto';

export const decodeStrictAny = (data: StrictAny) => {
  const type = (roots['decorated'].lookup(
    data.type_url
  ) as unknown) as Type | null;
  const decodedData = type?.decode(data.value);

  return decodedData;
};

export const encodeInnerData = (object: any) => {
  const output = { ...object };
  if (output?.data instanceof Message) {
    const message = output.data as Message;
    const encoded = message.$type.encode(message).finish();
    const newData = StrictAny.create({
      type_url: message.$type.name,
      value: encoded,
    });
    output.data = newData;
  }
  return output;
};
