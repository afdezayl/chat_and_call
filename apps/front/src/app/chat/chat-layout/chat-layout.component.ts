import { BreakpointObserver } from '@angular/cdk/layout';
import {
  CdkVirtualScrollViewport,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BasicMessage, Channel } from '@chat-and-call/channels/shared';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  EMPTY,
  interval,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { loadChannels, sendMessage, setFocus } from '../+state/chat.actions';
import {
  getFocusedChannel,
  getMessagesFromFocusChannel,
} from '../+state/chat.selectors';
import { ChatSocketService } from '../services/chat-socket.service';
import { ChatScrollStrategy } from './chat-scroll-strategy';

@Component({
  selector: 'chat-and-call-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useClass: ChatScrollStrategy,
    },
    ChatSocketService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  // TODO: separate on components
  messages$ = this.store.select(getMessagesFromFocusChannel);

  focus$ = this.store.select(getFocusedChannel);

  isMobileWidth$ = this.breakpointObserver.observe('(max-width: 800px)').pipe(
    filter((state) => Boolean(state)),
    map((state) => state.matches),
    distinctUntilChanged()
  );

  private readonly destroy$ = new Subject();

  index$ = new Subject<number>();
  scrollSubscription!: Subscription;

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  constructor(
    private store: Store,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadChannels());
  }

  ngAfterViewInit(): void {
    combineLatest([this.isMobileWidth$, this.focus$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isMobileWidth, isChannelSelected]) => {
        if (isMobileWidth && isChannelSelected) {
          this.sidenav.close();
        } else if (!isMobileWidth) {
          if (!this.sidenav.opened) {
            this.sidenav.open();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openMenu() {
    this.store.dispatch(setFocus({ id: null }));
    this.sidenav.open();
  }

  // TODO: Logic to scroll bottom on user message or near index
  goToEnd(index: number = -1) {
    if (this.viewport) {
      of(EMPTY)
        .pipe(
          tap((_) => this.viewport.scrollToIndex(index)),
          delay(50),
          tap((_) => this.viewport.scrollToIndex(index)),
          takeUntil(this.destroy$)
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
        take(100),
        takeUntil(this.destroy$)
      )
      .subscribe((m) => this.store.dispatch(sendMessage({ message: m })));
  }
}
