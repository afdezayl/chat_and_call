import { ListRange } from '@angular/cdk/collections';
import {
  CdkVirtualScrollViewport,
  VirtualScrollStrategy,
} from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { distinctUntilChanged, map, reduce, take } from 'rxjs/operators';

@Injectable()
export class ChatScrollStrategy implements VirtualScrollStrategy {
  private index$ = new BehaviorSubject<number>(0);
  private viewport: CdkVirtualScrollViewport | null = null;
  private itemsHeights: Array<number> = [];
  private checkedElements: number = 0;

  // TODO: DEFAULT_VALUE or @Input() or average
  private readonly DEFAULT_HEIGHT = 80;
  private readonly BUFFER_ITEMS_COUNT = 5;

  // Check resizing, emit datalengthchanged.
  // maybe resize event with debounce time is better
  private lastScrollOffset: number = 0;
  private lastViewportWidth: number = 0;
  private lastViewportHeight: number = 0;

  scrolledIndexChange = this.index$.pipe(distinctUntilChanged());

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
  }

  detach(): void {
    this.index$.complete();
    this.viewport = null;
    //this.viewport.
  }

  onContentScrolled(): void {
    const viewport = this.viewport;

    const scrollOffset = viewport.measureScrollOffset();
    const range = viewport.getRenderedRange();

    // 1. calculate the new range BUFFER + VISIBLE ITEMS + BUFFER
    const newRange = this.getRangeForScrollOffset(scrollOffset);

    // TODO: Reduce rerender cycles using top and bottom buffer
    if (range.start === newRange.start || range.end === newRange.end) {
    } else {
      // 2. set the rendered range
      viewport.setRenderedRange(newRange);
    }

    this.lastScrollOffset = scrollOffset;
    // 3. emit index$ position
    // TODO: index$(currentScroll, range)
  }

  onDataLengthChanged(): void {
    const totalElements = this.viewport.getDataLength();
    const scrollOffset = this.viewport.measureScrollOffset();

    if (totalElements > this.checkedElements) {
      this.updateItemListSize(this.viewport);
      const range = this.getRangeForScrollOffset(scrollOffset);

      this.viewport.setRenderedRange(range);
      this.setCurrentRangeOffset(range);
      this.updateRangeHeights(range);

      this.lastScrollOffset = this.viewport.measureScrollOffset();
    }

    // TODO: Resize event?
  }
  onContentRendered(): void {
    const currentRange = this.viewport.getRenderedRange();
    this.ngZone.runOutsideAngular(() =>
      this.awaitChangeDetection(() => {
        const isResized = this.isResized(this.viewport);
        if (isResized) {
          this.itemsHeights.fill(undefined);
        }

        this.updateRangeHeights(currentRange);
        this.setCurrentRangeOffset(currentRange);
        this.setTotalSize();
      })
    );
  }

  onRenderedOffsetChanged(): void {
    //throw new Error('Method not implemented.');
  }

  // TODO: index is last message or first in view?
  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    const absolutIndex =
      index < 0
        ? Math.max(0, this.viewport.getDataLength() + index)
        : Math.min(index, this.viewport.getDataLength() - 1);
    console.log('index: ', index, '-> ', absolutIndex);
  }

  /**
   * Only call this function after change detection
   */
  private updateRangeHeights(currentRange: ListRange) {
    const indexOffset = currentRange.start;
    const items = Array.from(
      this.viewport._contentWrapper.nativeElement.children
    );

    const itemHeight$ = from(items).pipe(
      map((m, i) => [m.getBoundingClientRect().height, i + indexOffset])
    );

    itemHeight$.subscribe(([h, i]) => (this.itemsHeights[i] = h));
  }

  private getRangeForScrollOffset(offset: number): ListRange {
    let acc = 0;
    let first = 0;
    for (let i = 0; i < this.itemsHeights.length; i++) {
      const height = this.itemsHeights[i] ?? this.DEFAULT_HEIGHT;
      acc += height;
      if (acc > offset) {
        first = i;
        break;
      }
    }

    const start = Math.max(0, first - this.BUFFER_ITEMS_COUNT);
    const end = Math.min(
      this.viewport.getDataLength(),
      first + 5 + this.BUFFER_ITEMS_COUNT
    );

    return {
      start,
      end,
    };
  }

  private setCurrentRangeOffset(currentRange: ListRange) {
    const rangeOffsetTop$ = from(this.itemsHeights).pipe(
      take(Math.max(currentRange.start, 0)),
      map((height) => height ?? this.DEFAULT_HEIGHT),
      reduce((acc, height) => acc + height, 0)
    );

    rangeOffsetTop$.subscribe((newOffset) =>
      this.viewport.setRenderedContentOffset(newOffset)
    );
  }

  private setTotalSize() {
    const totalSize$ = from(this.itemsHeights).pipe(
      map((height) => height ?? this.DEFAULT_HEIGHT),
      reduce((acc, height) => acc + height, 0)
    );
    totalSize$.subscribe((totalSize) =>
      this.viewport.setTotalContentSize(totalSize)
    );
  }

  private updateItemListSize(viewport: CdkVirtualScrollViewport) {
    const dataLength = viewport.getDataLength();

    while (this.itemsHeights.length < dataLength) {
      this.itemsHeights.push(undefined);
    }
    this.checkedElements = dataLength;
  }

  private awaitChangeDetection(fn: () => void) {
    Promise.resolve().then(fn);
  }

  private isResized(viewport: CdkVirtualScrollViewport): boolean {
    const nativeViewport = this.viewport.elementRef.nativeElement;
    const currentHeight = nativeViewport.clientHeight;
    const currentWidth = nativeViewport.clientWidth;

    const isResized =
      currentHeight !== this.lastViewportHeight ||
      currentWidth !== this.lastViewportWidth;

    this.lastViewportHeight = currentHeight;
    this.lastViewportWidth = currentWidth;

    //console.log(isResized, currentHeight, currentWidth);
    return isResized;
  }
}
