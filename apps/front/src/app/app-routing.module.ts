import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home/login',
  },
  {
    path: 'home',
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'signup',
        loadChildren: () =>
          import('./signup/signup.module').then((m) => m.SignupModule),
      },
    ],
  },
  /* {
    path: 'chat',
    loadChildren: () =>
      import('@chat-and-call/material/ui-material-design').then(
        (m) => m.MaterialDesignModule
      ),
  }, */
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
