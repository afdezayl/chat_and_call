import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Directive({
  selector: 'form',
})
export class ControlErrorsContainerDirective {
  submit$ = fromEvent(this.host.nativeElement, 'submit').pipe(shareReplay(1));

  constructor(private host: ElementRef<HTMLFormElement>) {}
}
