import { Injectable } from '@angular/core';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaDevicesService {
  constructor() {}

  getVideoStream() {
    return from(
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })
    );
  }
}
