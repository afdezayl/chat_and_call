import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

export interface FileProccess {
  totalSize: number;
  chunks: Array<Uint8Array>;
}

@Injectable({
  providedIn: 'root',
})
export class FileStoreService {
  private files = new Map<string, FileProccess>();

  constructor(private store: Store) {}

  createNewIncomingFile(id: string, totalSize: number) {
    console.log('new', id, totalSize);
    this.files.set(id, { totalSize, chunks: [] });
  }

  saveChunk(id: string, chunk: Uint8Array) {
    const previousValue = this.files.get(id);
    if (previousValue) {
      const newValue: FileProccess = {
        totalSize: previousValue.totalSize,
        chunks: [...previousValue.chunks, chunk],
      };
      this.files.set(id, newValue);

      const currentSize = newValue.chunks
        .map((ch) => ch.byteLength)
        .reduce((acc, length) => acc + length, 0);

      if (currentSize === newValue.totalSize) {
        console.log('finished');
        console.log(newValue);
        const blob = this.joinChunks(id);
        console.log(blob);
      }
      console.log('Size:', currentSize);
    }
  }

  private joinChunks(id: string): Blob {
    const chunks = this.files.get(id)?.chunks;
    console.time('union');
    const blob = new Blob(chunks);
    console.timeEnd('union');

    return blob;
  }
}
