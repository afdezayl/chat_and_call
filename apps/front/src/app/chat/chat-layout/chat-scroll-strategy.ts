import { ListRange } from '@angular/cdk/collections';
import {
  CdkVirtualScrollViewport,
  VirtualScrollStrategy,
} from '@angular/cdk/scrolling';
import { summaryFileName } from '@angular/compiler/src/aot/util';
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
  private readonly DEFAULT_HEIGHT = 84;
  private readonly BUFFER_ITEMS_COUNT = 5;

  // Check resizing, emit datalengthchanged.
  // maybe resize event with debounce time is better
  private lastScrollOffset: number = 0;
  private lastVisible: number = 0;
  private lastViewportWidth: number = 0;
  private lastViewportHeight: number = 0;

  scrolledIndexChange = this.index$.pipe(distinctUntilChanged());

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    if (viewport.getDataLength()) {
      this.onDataLengthChanged();
    }
  }

  detach(): void {
    this.index$.complete();
    this.viewport = null;
  }

  onContentScrolled(): void {
    if (!this.viewport) {
      return;
    }
    const viewport = this.viewport;
    const scrollOffset = viewport.measureScrollOffset();

    const range = viewport.getRenderedRange();

    // 1. calculate the new range BUFFER + VISIBLE ITEMS + BUFFER
    const newRange = this.getRangeForScrollOffset(scrollOffset);

    const delta = range.start + range.end - (newRange.start + newRange.end);
    //console.log(delta);

    // TODO: Reduce rerender cycles using top and bottom buffer
    if (
      Math.abs(delta) >
      this.BUFFER_ITEMS_COUNT /
        2 /* range.start !== newRange.start || range.end !== newRange.end */
    ) {
      // 2. set the rendered range
      viewport.setRenderedRange(newRange);
    }
    // 3. emit index$ position
    //this.index$.next(this.lastVisible);
    this.onContentRendered();

    /* this.ngZone.runOutsideAngular(() => {
      this.awaitChangeDetection(() => {
        this.lastScrollOffset = scrollOffset;
        //this.setTotalSize();
        // 3. emit index$ position
        this.index$.next(this.lastVisible);
      });
    }); */
  }

  onDataLengthChanged(): void {
    if (!this.viewport) {
      return;
    }
    const totalElements = this.viewport.getDataLength();
    const scrollOffset = this.viewport.measureScrollOffset('top');

    const range = this.getRangeForScrollOffset(scrollOffset);

    if (totalElements > this.checkedElements) {
      this.updateItemListSize(this.viewport);
      /* this.updateRangeHeights(range);
      this.setTotalSize(); */
    }

    this.viewport.setRenderedRange(range);
    this.onContentRendered();

    // TODO: Resize event?
  }
  onContentRendered(): void {
    if (!this.viewport) {
      return;
    }
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
        this.index$.next(this.lastVisible);
      })
    );
  }

  onRenderedOffsetChanged(): void {
    //throw new Error('Method not implemented.');
  }

  // TODO: index is last message or first in view?
  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (!this.viewport) {
      return;
    }
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
    //console.log('updating heights...');
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
    let notVisibleElementsTop = 0;
    let onViewport = 0;

    //console.log(offset, this.viewport.elementRef.nativeElement.scrollTop);

    const areRenderedAllItems =
      this.viewport.getDataLength() === this.itemsHeights.length;

    const maxTotalHeight =
      this.itemsHeights
        .map((h) => (isNaN(h) ? this.DEFAULT_HEIGHT : h))
        .reduce((sum, h) => sum + h, 0) ?? 0;
    const maxViewportOffset = offset + this.viewport.getViewportSize();

    const visibleOffset = areRenderedAllItems
      ? Math.min(maxTotalHeight, maxViewportOffset)
      : maxViewportOffset;

    for (let i = 0; i < this.viewport.getDataLength(); i++) {
      const height = this.itemsHeights[i] ?? this.DEFAULT_HEIGHT;
      if (acc < offset) {
        notVisibleElementsTop++;
      } else if (acc + height <= visibleOffset) {
        //console.log(acc + height, visibleOffset);
        onViewport++;
      } else {
        break;
      }
      acc += height;
    }

    const start = Math.max(0, notVisibleElementsTop - this.BUFFER_ITEMS_COUNT);
    const end = Math.min(
      this.viewport.getDataLength(),
      notVisibleElementsTop + onViewport + this.BUFFER_ITEMS_COUNT
    );

    this.lastVisible = Math.max(0, notVisibleElementsTop + onViewport - 1);
    /*this.index$.next(this.lastVisible); */

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

    //console.log(currentRange, this.viewport.getOffsetToRenderedContentStart());

    rangeOffsetTop$.subscribe((newOffset) => {
      /* console.log(

        newOffset,
       // this.viewport.getOffsetToRenderedContentStart()
      ); */
      this.viewport.setRenderedContentOffset(newOffset);
      //console.log('after ->', this.viewport.getOffsetToRenderedContentStart());
    });
  }

  private setTotalSize() {
    const totalSize$ = from(this.itemsHeights).pipe(
      map((height) => height ?? this.DEFAULT_HEIGHT),
      reduce((acc, height) => acc + height, 0)
    );
    totalSize$.subscribe((totalSize) => {
      //console.log('total size -', totalSize, this.itemsHeights.length);

      this.viewport.setTotalContentSize(totalSize);
    });
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
