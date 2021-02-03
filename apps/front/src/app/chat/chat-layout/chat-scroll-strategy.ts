import { ListRange } from '@angular/cdk/collections';
import {
  CdkVirtualScrollViewport,
  VirtualScrollStrategy,
} from '@angular/cdk/scrolling';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class ChatScrollStrategy implements VirtualScrollStrategy {
  private index$ = new BehaviorSubject<number>(0);
  private viewport: CdkVirtualScrollViewport | null = null;
  private itemsHeights: Array<number | undefined> = [];
  private checkedElements: number = 0;

  // TODO: DEFAULT_VALUE or @Input() or average
  private readonly DEFAULT_HEIGHT = 84;
  private readonly BUFFER_ITEMS_COUNT = 5;

  // Check resizing, emit datalengthchanged.
  // maybe resize event with debounce time is better
  private lastVisibleIndex: number = 0;
  private lastViewportWidth: number = 0;
  private lastViewportHeight: number = 0;

  /** Emits when the index of the last element visible in the viewport changes. */
  scrolledIndexChange = this.index$.pipe(distinctUntilChanged());

  constructor(private ngZone: NgZone) {}

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.index$.next(0);

    if (viewport.getDataLength()) {
      this.onDataLengthChanged();
      this.onContentRendered();
    }
  }

  detach(): void {
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
    const newRange = this.getRangeForScrollOffset(scrollOffset, viewport);

    const delta = range.start + range.end - (newRange.start + newRange.end);

    // 2. Reduce rerender cycles using top and bottom buffer
    if (Math.abs(delta) > this.BUFFER_ITEMS_COUNT / 2) {
      viewport.setRenderedRange(newRange);
    }

    this.onContentRendered();
  }

  onDataLengthChanged(): void {
    if (!this.viewport) {
      return;
    }
    const totalElements = this.viewport.getDataLength();
    const scrollOffset = this.viewport.measureScrollOffset('top');

    const range = this.getRangeForScrollOffset(scrollOffset, this.viewport);

    if (totalElements > this.checkedElements) {
      this.updateItemListSize(this.viewport);
    }

    this.viewport.setRenderedRange(range);
    this.onContentRendered();
  }

  onContentRendered(): void {
    if (!this.viewport) {
      return;
    }
    const currentRange = this.viewport.getRenderedRange();
    this.ngZone.runOutsideAngular(() =>
      this.awaitChangeDetection(() => {
        if (this.isResized(this.viewport!)) {
          this.itemsHeights.fill(undefined);
        }

        this.updateRangeHeights(currentRange);
        this.setCurrentRangeOffset(currentRange);
        this.setTotalSize();

        this.index$.next(this.lastVisibleIndex);
      })
    );
  }

  onRenderedOffsetChanged(): void {}

  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (!this.viewport) {
      return;
    }
    const absolutIndex =
      index < 0
        ? Math.max(0, this.viewport.getDataLength() + index)
        : Math.min(index, this.viewport.getDataLength() - 1);

    const itemOffset = this.getIndexOffset(absolutIndex);
    const itemHeight = this.itemsHeights[absolutIndex] ?? this.DEFAULT_HEIGHT;

    const offset =
      itemOffset + 2 * itemHeight - this.viewport.getViewportSize();

    this.viewport.scrollToOffset(offset, behavior);
  }

  /**
   * Only call this function after change detection
   */
  private updateRangeHeights(currentRange: ListRange) {
    if (!this.viewport) {
      return;
    }
    const indexOffset = currentRange.start;
    const items = Array.from(
      this.viewport._contentWrapper.nativeElement.children
    );

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      this.itemsHeights[i + indexOffset] = item.getBoundingClientRect().height;
    }
  }

  private getRangeForScrollOffset(
    offset: number,
    viewport: CdkVirtualScrollViewport
  ): ListRange {
    const areRenderedAllItems =
      viewport.getDataLength() === this.itemsHeights.length;

    const maxTotalHeight = this.getIndexOffset(viewport.getDataLength());
    const maxViewportOffset = offset + viewport.getViewportSize();

    const visibleOffset = areRenderedAllItems
      ? Math.min(maxTotalHeight, maxViewportOffset)
      : maxViewportOffset;

    let acc = 0;
    let notVisibleElementsTop = 0;
    let onViewport = 0;

    for (let i = 0; i < viewport.getDataLength(); i++) {
      const height = this.itemsHeights[i] ?? this.DEFAULT_HEIGHT;
      if (acc < offset) {
        notVisibleElementsTop++;
      } else if (acc + height <= visibleOffset) {
        onViewport++;
      } else {
        break;
      }
      acc += height;
    }

    const start = Math.max(0, notVisibleElementsTop - this.BUFFER_ITEMS_COUNT);
    const end = Math.min(
      viewport.getDataLength(),
      notVisibleElementsTop + onViewport + this.BUFFER_ITEMS_COUNT
    );

    // Side effect
    this.lastVisibleIndex = Math.max(0, notVisibleElementsTop + onViewport - 1);

    return {
      start,
      end,
    };
  }

  private setCurrentRangeOffset(currentRange: ListRange) {
    // TODO: think about top and bottom offset. Performance on large list?
    if (!this.viewport) {
      return;
    }
    let newOffset = this.getIndexOffset(currentRange.start);
    this.viewport.setRenderedContentOffset(newOffset);
  }

  private setTotalSize() {
    if (!this.viewport) {
      return;
    }
    const totalSize = this.getIndexOffset(this.viewport.getDataLength());
    this.viewport.setTotalContentSize(totalSize);
  }

  private getIndexOffset(index: number) {
    let offset = 0;
    for (let i = 0; i < Math.max(index, 0); i++) {
      const height = this.itemsHeights[i] ?? this.DEFAULT_HEIGHT;
      offset += height;
    }
    return offset;
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
    const nativeViewport = viewport.elementRef.nativeElement;
    const currentHeight = nativeViewport.clientHeight;
    const currentWidth = nativeViewport.clientWidth;

    const isResized =
      currentHeight !== this.lastViewportHeight ||
      currentWidth !== this.lastViewportWidth;

    this.lastViewportHeight = currentHeight;
    this.lastViewportWidth = currentWidth;

    return isResized;
  }
}
