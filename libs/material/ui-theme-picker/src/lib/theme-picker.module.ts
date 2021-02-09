import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { ThemePickerComponent } from './theme-picker.component';
import { ThemePickerService } from './theme-picker.service';

@NgModule({
  declarations: [ThemePickerComponent],
  imports: [CommonModule, MaterialDesignModule],
  providers: [ThemePickerService],
  exports: [ThemePickerComponent],
})
export class ThemePickerModule {
  // Autoload theme
  constructor(private themePickerService: ThemePickerService) {}
}
