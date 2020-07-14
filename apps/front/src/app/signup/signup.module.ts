import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignupLayoutComponent } from './signup-layout/signup-layout.component';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';

export const routes: Routes = [{ path: '', component: SignupLayoutComponent }];
export const loader = ['en', 'es'].reduce((acc, lang) => {
  acc[lang] = () => import(`./i18n/${lang}.json`);
  return acc;
}, {});
@NgModule({
  declarations: [SignupLayoutComponent],
  imports: [
    CommonModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslocoModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'signup',
        loader,
      },
    },
  ],
})
export class SignupModule {}
