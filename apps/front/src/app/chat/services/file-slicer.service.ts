import { Injectable } from '@angular/core';
import { CHUNK_SIZE_BYTES } from '@chat-and-call/socketcluster/shared';

@Injectable({
  providedIn: 'root',
})
export class FileSlicerService {
  constructor() {}

  blobSlicer(file: Blob) {
    return {
      [Symbol.asyncIterator]() {
        let i = 0;
        let offset = 0;
        const end = file.size;

        return {
          async next() {
            if (offset < end) {
              const data = await blobToUint8(
                file.slice(offset, offset + CHUNK_SIZE_BYTES)
              );

              const chunk = { order: i++, data: data };
              offset += CHUNK_SIZE_BYTES;
              return { value: chunk, done: false };
            }

            return { done: true, value: null };
          },
        };
      },
    };
  }
}

const blobToUint8 = (blob: Blob): Promise<Uint8Array> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };

    reader.readAsArrayBuffer(blob);
  });
};
