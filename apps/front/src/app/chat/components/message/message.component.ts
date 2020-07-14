import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { Message } from '@chat-and-call/channels/shared';

@Component({
  selector: 'chat-and-call-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements AfterViewInit {
  @Input() message: Message;
  @Output() viewed = new EventEmitter<boolean>();

  isFirstLoad = true;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const parent = this.elementRef.nativeElement.parentElement;
    const observer = new IntersectionObserver(this.emitViewed.bind(this), {
      root: parent,
      threshold: 0.5,
    });
    observer.observe(this.elementRef.nativeElement);
  }

  emitViewed(
    entries: Array<IntersectionObserverEntry>,
    observer: IntersectionObserver
  ) {
    entries.forEach((entry) => {
      if (this.isFirstLoad) {
        const element = this.elementRef.nativeElement;
        const container = this.elementRef.nativeElement.parentElement;

        const yRelative = element.offsetTop - container.offsetTop;
        const containerHeight = container.clientHeight;
        const shouldScroll = yRelative - container.scrollTop - containerHeight * 1.35 < 0;

        if(shouldScroll) {
          container.scrollTop = container.scrollHeight;
        } else{
          this.viewed.next(false);
        }
        this.isFirstLoad = false;
      }
      if (entry.isIntersecting) {
        this.elementRef.nativeElement.style.backgroundColor = 'yellowgreen';
        observer.unobserve(this.elementRef.nativeElement);

        this.viewed.next(true);
        this.viewed.complete();
      }
    });
  }
}
