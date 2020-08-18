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
import { Store } from '@ngrx/store';
import { getUsername } from '../../+state/chat.selectors';

@Component({
  selector: 'chat-and-call-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements AfterViewInit {
  @Input() message: Message;
  @Output() viewed = new EventEmitter<boolean>();
  username$ = this.store.select(getUsername);

  constructor(
    private store: Store,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit() {
    const wrapper = this.elementRef.nativeElement.parentElement;
    const parent = wrapper.parentElement;

    /* const observer = new IntersectionObserver(this.emitViewed.bind(this), {
      root: parent,
      threshold: 0.5,
    });
    observer.observe(this.elementRef.nativeElement); */
  }

  emitViewed(
    entries: Array<IntersectionObserverEntry>,
    observer: IntersectionObserver
  ) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        //this.elementRef.nativeElement.style.backgroundColor = 'yellowgreen';
        observer.unobserve(this.elementRef.nativeElement);

        this.viewed.next(true);
        this.viewed.complete();
      }
    });
  }
}
