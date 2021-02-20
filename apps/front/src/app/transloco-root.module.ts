import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { UiLanguagePickerModule } from '@chat-and-call/material/ui-language-picker';
import {
  AvailableLangs,
  Translation,
  translocoConfig,
  TranslocoLoader,
  TranslocoModule,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
} from '@ngneat/transloco';
import { environment } from '../environments/environment';

export const availableLangs: AvailableLangs = [
  { id: 'es-ES', label: 'Español' },
  { id: 'en-GB', label: 'English' },
];
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule, UiLanguagePickerModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs,
        defaultLang: 'es-ES',
        reRenderOnLangChange: true,
        prodMode: environment.production,
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class TranslocoRootModule {}
