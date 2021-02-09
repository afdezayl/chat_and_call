import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

const LOCAL_STORAGE_KEY = 'selected-theme';
const DEFAULT_THEME = 'default-theme';

@Injectable({ providedIn: 'any' })
export class ThemePickerService {
  private readonly _themes = ['default-theme', 'dark-theme', 'candy-theme'];

  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument,
    private dialog: MatDialog
  ) {
    this.setTheme(this.currentTheme);
  }

  get currentTheme() {
    return localStorage.getItem(LOCAL_STORAGE_KEY) ?? DEFAULT_THEME;
  }

  get themes() {
    return this._themes;
  }

  setTheme(theme: string) {
    const classList = this.document.body.classList;

    const toRemove = Array.from(classList).filter((item: string) =>
      item.includes('-theme')
    );
    if (toRemove.length) {
      classList.remove(...toRemove);
    }
    classList.add(theme);
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  }
}

export interface DialogData {
  themes: Array<string>;
  previous: string;
  selected?: string;
}
