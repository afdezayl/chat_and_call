import {
  CdkVirtualScrollViewport,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasicMessage, Channel } from '@chat-and-call/channels/shared';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  EMPTY,
  interval,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  delay,
  expand,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { loadChannels, sendMessage, setFocus } from '../+state/chat.actions';
import {
  getFocusedChannel,
  getMessagesFromFocusChannel,
} from '../+state/chat.selectors';
import { ChatScrollStrategy } from './chat-scroll-strategy';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'chat-and-call-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useClass: ChatScrollStrategy,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatLayoutComponent implements OnInit, OnDestroy {
  // TODO: separate on components
  // channels-container
  focus$ = this.store.select(getFocusedChannel).pipe(
    //tap((focus) => this.goToEnd()),
    tap((focus) => {
      if (this.mobileQuery?.matches) {
        this.sidenav?.close();
      }
    })
  );

  mobileQuery: MediaQueryList;

  // messageContainer
  unreaded$ = new BehaviorSubject<number>(0);

  newMessagesCount = 0;
  messages$ = this.store
    .select(getMessagesFromFocusChannel)
    .pipe(
      //tap((messages) => this.goToEnd())
      );

  index$ = new Subject<number>();
  scrollSubscription: Subscription;

  @ViewChild('message_container') messageContainer: ElementRef<HTMLDivElement>;
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  private _mobileListener: () => void;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileListener);
  }

  ngOnInit(): void {
    this.store.dispatch(loadChannels());

    //this.index$.subscribe((index) => console.log('index change -> ', index));
    // this.setFocus(1);
  }

  openMenu() {
    this.store.dispatch(setFocus({ id: null }));
    this.sidenav.open();
  }

  onViewed(isViewed: boolean) {
    if (isViewed) {
      this.newMessagesCount++;
    }
  }

  goToEnd() {
    if (this.viewport) {
      if (this.scrollSubscription) {
        this.scrollSubscription.unsubscribe();
      }

      const scrollBottom$ = of(EMPTY).pipe(
        switchMap(() => of(this.viewport.measureScrollOffset())),
        tap(() => this.viewport.scrollTo({ bottom: 0 })),
        debounceTime(200),
        delay(200),
        map(
          (initialScroll) =>
            this.viewport.measureScrollOffset() !== initialScroll
        )
      );

      this.scrollSubscription = scrollBottom$
        .pipe(
          expand((isScrolling) => {
            if (isScrolling) {
              return scrollBottom$;
            }
            this.viewport.scrollTo({ bottom: 0 });
            return EMPTY;
          }, 1)
        )
        .subscribe();
    }
  }

  fakeMessages(channel: Channel) {
    interval(10)
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
