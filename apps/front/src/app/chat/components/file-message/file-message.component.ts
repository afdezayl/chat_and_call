import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatFileMessage } from '../../+state/chat.reducer';

@Component({
  selector: 'chat-and-call-file-message',
  templateUrl: './file-message.component.html',
  styleUrls: ['./file-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileMessageComponent implements OnInit, OnDestroy {
  @Input() file!: ChatFileMessage;
  private url?: string;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.url) {
      URL.revokeObjectURL(this.url);
    }
  }
  progressBarMode(): ProgressBarMode {
    const file = this.file;
    if (file.downloaded < file.size) {
      return 'determinate';
    }

    if (file.downloaded === file.size) {
      return file.done ? 'determinate' : 'indeterminate';
    }

    return 'indeterminate';
  }

  getDownloadURL() {
    const blob = this.file.blob;
    if (blob) {
      console.log(blob);
      const url = URL.createObjectURL(blob);
      this.url = url;

      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return null;
  }
}
