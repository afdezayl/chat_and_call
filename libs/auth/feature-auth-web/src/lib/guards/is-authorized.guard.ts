import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedGuard implements CanLoad, CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad() {
    return this._check();
  }
  canActivate() {
    return this._check();
  }

  private _check() {
    return this.authService
      .isAuthorized()
      .pipe(
        map((isAuth) => (isAuth ? true : this.router.createUrlTree(['/'])))
      );
  }
}

@Injectable({
  providedIn: 'root',
})
export class IsNotLoggedGuard implements CanLoad, CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad() {
    return this._check();
  }
  canActivate() {
    return this._check();
  }

  private _check() {
    return this.authService
      .isAuthorized()
      .pipe(
        map((isAuth) => (isAuth ? this.router.createUrlTree(['chat']) : true))
      );
  }
}
