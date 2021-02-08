import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { EMPTY, ObservableInput, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@Injectable({
  providedIn: 'root',
})
export class FullscreenLoadingService {
  private overlayRef!: OverlayRef;

  constructor(private overlay: Overlay) {}

  showLoading<T>(stream$: ObservableInput<T>) {
    return of(EMPTY).pipe(
      tap((_) => this.show()),
      switchMap((_) => stream$),
      tap((_) => this.hide()),
      catchError((err) => {
        this.hide();
        return throwError(err);
      })
    );
  }

  private show(message?: string) {
    this.overlayRef = this.overlay.create();
    const component = this.overlayRef.attach(
      new ComponentPortal(LoadingSpinnerComponent)
    );
    //component.instance.message = message;
  }

  private hide() {
    this.overlayRef.detach();
  }
}
