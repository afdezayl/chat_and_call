import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguagePickerDialogService } from './language-picker-dialog.service';
import { LanguagePickerService } from './language-picker.service';
import { LanguagePickerComponent } from './language-picker/language-picker.component';
import { CountryLowercasePipe } from './language-picker/country-lowercase.pipe';

@NgModule({
  imports: [CommonModule, TranslocoModule, MaterialDesignModule],
  declarations: [LanguagePickerComponent, CountryLowercasePipe],
  providers: [LanguagePickerService, LanguagePickerDialogService],
})
export class UiLanguagePickerModule {}
