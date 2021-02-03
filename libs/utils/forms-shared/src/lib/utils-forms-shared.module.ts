import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { TranslocoModule } from '@ngneat/transloco';
import {
  ControlErrorComponent,
  ControlErrorsDirective,
  FormErrorsJsonPipe,
  ControlErrorsContainerDirective,
} from './errors';
import { FullscreenLoadingService } from './loading';
import { LoadingSpinnerComponent } from './loading/loading-spinner/loading-spinner.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    TranslocoModule,
  ],
  declarations: [
    FormErrorsJsonPipe,
    ControlErrorComponent,
    ControlErrorsDirective,
    ControlErrorsContainerDirective,
    LoadingSpinnerComponent,
  ],
  exports: [
    FormErrorsJsonPipe,
    ControlErrorsDirective,
    ControlErrorsContainerDirective,
    ControlErrorComponent,
  ],
})
export class UtilsFormsSharedModule {}
