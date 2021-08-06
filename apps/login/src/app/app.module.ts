import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthConfigModule } from './auth/auth-config.module';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: 'unauthorized', component: UnauthorizedComponent },
    ]),
    AuthConfigModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
