import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

export interface LanguageLabel {
  id: string;
  label: string;
}

type AvailableLang = string | LanguageLabel;

@Injectable({
  providedIn: 'root',
})
export class LanguagePickerService {
  constructor(private translocoService: TranslocoService) {}

  get languages(): Array<LanguageLabel> {
    const langs: Array<AvailableLang> = this.translocoService.getAvailableLangs();

    return langs.map((l) => (typeof l === 'string' ? { id: l, label: l } : l));
  }

  get activeLang() {
    return this.translocoService.getActiveLang();
  }

  setLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }
}
