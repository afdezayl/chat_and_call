import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { WebRtcService } from '../../services/web-rtc.service';
import { MediaDevicesService } from '../../services/media-devices.service';
import { tap, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { ChatSocketService } from '../../services/chat-socket.service';

@Component({
  selector: 'chat-and-call-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCallComponent implements OnInit {
  @ViewChild('local') localVideo!: ElementRef<HTMLVideoElement>;

  mediaDevices$ = from(navigator.mediaDevices.enumerateDevices());

  constructor(
    private rtc: WebRtcService,
    private media: MediaDevicesService,
    private socket: ChatSocketService
  ) {}

  ngOnInit(): void {}

  takePhoto() {
    console.log('Profile photo...');
  }

  call() {
    console.log('audio call');
  }

  videocall() {
    this.rtc
      .createConnection()
      .pipe(switchMap((description) => this.socket.videoCall(description)))
      .subscribe(console.log, console.error);
    /* this.media
      .getVideoStream()
      .pipe(
        tap((stream) => (this.localVideo.nativeElement.srcObject = stream)),
        tap(() => this.rtc.createConnection()),
        catchError((err) => of(console.error(err)))
      )
      .subscribe(); */
    console.log('video call');
  }
}
