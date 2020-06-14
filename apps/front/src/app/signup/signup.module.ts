import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignupLayoutComponent } from './signup-layout/signup-layout.component';

export const routes: Routes = [
  {path: '', component: SignupLayoutComponent}
];
@NgModule({
  declarations: [SignupLayoutComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class SignupModule {}
