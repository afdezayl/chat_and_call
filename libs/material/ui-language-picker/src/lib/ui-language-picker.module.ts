import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguagePickerDialogService } from './language-picker-dialog.service';
import { LanguagePickerService } from './language-picker.service';
import { LanguagePickerComponent } from './language-picker/language-picker.component';

@NgModule({
  imports: [CommonModule, TranslocoModule, MaterialDesignModule],
  declarations: [LanguagePickerComponent],
  providers: [LanguagePickerService, LanguagePickerDialogService],
})
export class UiLanguagePickerModule {}
