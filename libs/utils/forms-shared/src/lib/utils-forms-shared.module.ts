import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import {
  FormErrorsJsonPipe,
  CustomErrorsDirective,
  ControlErrorComponent,
} from './errors';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialDesignModule],
  declarations: [
    FormErrorsJsonPipe,
    ControlErrorComponent,
    CustomErrorsDirective,
  ],
  exports: [FormErrorsJsonPipe, CustomErrorsDirective, ControlErrorComponent],
})
export class UtilsFormsSharedModule {}
