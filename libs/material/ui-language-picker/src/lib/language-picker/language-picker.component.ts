import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LanguagePickerService } from '../language-picker.service';

@Component({
  selector: 'chat-and-call-language-picker',
  templateUrl: './language-picker.component.html',
  styleUrls: ['./language-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagePickerComponent {
  langs = this.languagePicker.languages;
  previousLang = this.languagePicker.activeLang;
  selectedLang = this.languagePicker.activeLang;

  constructor(
    private languagePicker: LanguagePickerService,
    public dialogRef: MatDialogRef<LanguagePickerComponent>
  ) {}

  changeSelectedLang(lang: string) {
    this.languagePicker.setLang(lang);
    this.selectedLang = lang;
  }

  cancel() {
    this.languagePicker.setLang(this.previousLang);
    this.dialogRef.close();
  }

  confirm() {
    this.languagePicker.setLang(this.selectedLang);
    this.dialogRef.close();
  }
}
