import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  IsLoggedGuard,
  IsNotLoggedGuard,
} from '@chat-and-call/auth/feature-auth-web';

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
        //canLoad: [IsNotLoggedGuard],
        canActivate: [IsNotLoggedGuard]
      },
      {
        path: 'signup',
        loadChildren: () =>
          import('./signup/signup.module').then((m) => m.SignupModule),
        //canLoad: [IsNotLoggedGuard],
        canActivate: [IsNotLoggedGuard]
      },
      {
        path: '**',
        redirectTo: 'home/login',
      },
    ],
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
    //canLoad: [IsLoggedGuard],
    canActivate: [IsLoggedGuard]
  },
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
