import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialDesignModule } from '@chat-and-call/material/ui-material-design';
import { TranslocoModule } from '@ngneat/transloco';
import { UtilsFormsSharedModule } from 'libs/utils/forms-shared/src/lib';
import { LoginLayoutComponent } from './login-layout/login-layout.component';

export const routes: Routes = [{ path: '', component: LoginLayoutComponent }];

@NgModule({
  declarations: [LoginLayoutComponent],
  imports: [
    CommonModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslocoModule,
    UtilsFormsSharedModule,
  ],
})
export class LoginModule {}
