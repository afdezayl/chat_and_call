import {
  CdkVirtualScrollViewport,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicMessage, Channel } from '@chat-and-call/channels/shared';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  EMPTY,
  interval,
  of,
  ReplaySubject,
  Subscription,
  throwError,
} from 'rxjs';
import {
  debounceTime,
  delay,
  map,
  switchMap,
  take,
  tap,
  retryWhen,
  concatMap,
} from 'rxjs/operators';
import { loadChannels, sendMessage, setFocus } from '../+state/chat.actions';
import {
  getChannels,
  getFocusedChannel,
  getMessagesFromFocusChannel,
} from '../+state/chat.selectors';
import { ChatScrollStrategy } from './chat-scroll-strategy';
import { ChatSocketService } from '../services/chat-socket.service';

export const factory = () => new ChatScrollStrategy(200, 500);

@Component({
  selector: 'chat-and-call-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: factory,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatLayoutComponent implements OnInit {
  messageForm: FormGroup;
  // TODO: separate on components
  // channels-container

  channels$ = this.store.select(getChannels);
  focus$ = this.store
    .select(getFocusedChannel)
    .pipe(tap((focus) => this.goToEnd()));

  // messageContainer
  unreaded$ = new BehaviorSubject<number>(0);

  newMessagesCount = 0;
  messages$ = this.store
    .select(getMessagesFromFocusChannel)
    .pipe(tap((messages) => this.goToEnd()));

  index$ = new ReplaySubject<number>(0);
  scrollSubscription: Subscription;

  @ViewChild('message_container') messageContainer: ElementRef<HTMLDivElement>;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.store.dispatch(loadChannels());

    this.messageForm = this.fb.group({
      text: this.fb.control('', Validators.required),
      file: this.fb.control(null),
    });
    this.setFocus(1);
  }

  onViewed(isViewed: boolean) {
    if (isViewed) {
      this.newMessagesCount++;
    }
  }

  setFocus(id: number) {
    this.store.dispatch(setFocus({ id: id.toString() }));
  }

  sendMessage(idChannel: string) {
    const message: BasicMessage = {
      text: this.messageForm.value.text,
      channel: idChannel,
    };
    this.messageForm.reset();

    this.store.dispatch(sendMessage({ message }));
  }

  goToEnd() {
    if (this.viewport) {
      if (this.scrollSubscription) {
        this.scrollSubscription.unsubscribe();
      }

      const scrollBottom$ = of(EMPTY).pipe(
        switchMap(() => of(this.viewport.measureScrollOffset())),
        tap(() => this.viewport.scrollTo({ bottom: 0 })),
        debounceTime(1000),
        delay(200),
        map(
          (initialScroll) =>
            this.viewport.measureScrollOffset() !== initialScroll
        )
      );

      /* this.scrollSubscription = scrollBottom$
        .pipe(
          expand((isScrolling) => {
            if (isScrolling) {
              return scrollBottom$;
            }
            this.viewport.scrollTo({ bottom: 0 });
            return EMPTY;
          }, 1)
        )
        .subscribe(); */
      /* const totalData = this.viewport.getDataLength();
      const currentRange = this.viewport.getRenderedRange();
      const itemsDisplayed = currentRange.end - currentRange.start;

      const updatedItemsCount = Math.min(itemsDisplayed);

      console.log(this.viewport.getDataLength(), itemsDisplayed, updatedItemsCount);
      this.viewport.setRenderedRange({
        start: totalData - updatedItemsCount,
        end: totalData,
      });
      const offset = this.viewport.getOffsetToRenderedContentStart();
      console.log(offset, 84 * (totalData - updatedItemsCount));

      this.viewport.setRenderedContentOffset(
        offset,
        'to-start'
      ); */
      /* this.scrollSubscription = of(EMPTY)
        .pipe(
          tap((_) => this.viewport.scrollTo({ bottom: 0 })),
          delay(200),
          tap((_) => this.viewport.scrollTo({ bottom: 0 }))
        )
        .subscribe(); */
      //this.viewport.scrollTo({bottom: 0})
    }
  }

  fakeMessages(channel: Channel) {
    interval(100)
      .pipe(
        map((x, i) => {
          const message: BasicMessage = {
            channel: channel.id,
            text: '' + (i + 1),
          };
          return message;
        }),
        take(100)
      )
      .subscribe((m) => this.store.dispatch(sendMessage({ message: m })));
  }
}
