import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  Output,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, ThemePickerService } from './theme-picker.service';

@Component({
  selector: 'polls-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent implements OnInit {
  selected = this.themePickerService.currentTheme;
  previous = this.themePickerService.currentTheme;
  themes = this.themePickerService.themes;

  constructor(
    private themePickerService: ThemePickerService,
    public dialogRef: MatDialogRef<ThemePickerComponent>
  ) {}

  ngOnInit(): void {}

  changeSelected(theme: string) {
    this.themePickerService.setTheme(theme);
    this.selected = theme;
  }

  cancel() {
    this.themePickerService.setTheme(this.previous);
    this.dialogRef.close();
  }

  confirm() {
    this.themePickerService.setTheme(this.selected);
    this.dialogRef.close();
  }
}
