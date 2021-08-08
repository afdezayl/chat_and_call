import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'chat-and-call-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  auth$ = new BehaviorSubject<LoginResponse | null>(null);
  token?: string;

  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe((data) => {
      console.log(data);
      if(data.isAuthenticated) {
        this.token = data.idToken;
      }
      this.auth$.next(data);
    });
  }
  login() {
    this.oidcSecurityService.authorize();
  }


  logout() {
    console.log(this.oidcSecurityService.getIdToken());
    this.oidcSecurityService.logoff();
  }
}
