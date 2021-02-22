import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { FileSlicerService } from './file-slicer.service';

export interface FileProccess {
  totalSize: number;
  checksum: string;
  chunks: Array<Uint8Array>;
}

@Injectable({
  providedIn: 'root',
})
export class FileStoreService {
  private files = new Map<string, FileProccess>();

  constructor(private store: Store, private blobSlicer: FileSlicerService) {}

  createNewIncomingFile(id: string, totalSize: number, checksum: string) {
    this.files.set(id, { totalSize, checksum, chunks: [] });
  }

  saveChunk(id: string, chunk: Uint8Array) {
    const previousValue = this.files.get(id);
    if (previousValue) {
      const newValue: FileProccess = {
        ...previousValue,
        chunks: [...previousValue.chunks, chunk],
      };
      this.files.set(id, newValue);

      const currentSize = newValue.chunks
        .map((ch) => ch.byteLength)
        .reduce((acc, length) => acc + length, 0);

      if (currentSize === newValue.totalSize) {
        const blob = this.joinChunks(id);
        this.blobSlicer
          .getChecksum(blob)
          .then((hash) =>
            console.log('hash matches => ', newValue.checksum === hash)
          );
      }
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
