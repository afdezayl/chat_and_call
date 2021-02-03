import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebRtcService {
  constructor() {}

  createConnection() {
    // TODO: stun server?
    const connection = new RTCPeerConnection();
    const sendChannel = connection.createDataChannel('text');

    connection.addEventListener('icecandidate', (ev) => {
      console.log('icecandidate', ev);
      /* if (ev.candidate) {
        connection
          .addIceCandidate(ev.candidate)
          .then(console.log, console.error);
      } */
    });
    connection.addEventListener('connectionstatechange', (ev) =>
      console.log('conn state change', ev)
    );
    connection.addEventListener('datachannel', (ev) =>
      console.log('datachannel', ev)
    );
    sendChannel.addEventListener('open', (ev) =>
      console.log('channel open', ev)
    );

    return from(connection.createOffer()).pipe(
      tap((description) => connection.setLocalDescription(description))
    );
  }
}
