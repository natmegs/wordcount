import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, timer, Subscription } from 'rxjs';
import { filter, flatMap, mergeMap } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AUTH_CONFIG } from './auth0-variables';

@Injectable()
export class AuthService {
  userProfile: any;
  requestedScopes: string = 'openid profile';
  refreshSubscription: Subscription;

  auth0: any;

  constructor(
      public router: Router,
      public jwtHelper: JwtHelperService
    ) { 
        this.auth0 = new auth0.WebAuth({
            clientID: AUTH_CONFIG.clientId,
            domain: AUTH_CONFIG.domain,
            responseType: 'token id_token',
            audience: AUTH_CONFIG.audience,
            redirectUri: AUTH_CONFIG.callbackURL,
            scope: this.requestedScopes
        });
    }

  public login(): void {
      this.auth0.authorize();
  }

  public handleAuthentication(): void {
      this.auth0.parseHash((err, authResult) => {
          if(authResult && authResult.accessToken && authResult.idToken) {
              window.location.hash = ''
              this.setSession(authResult)
              this.router.navigate(['/dashboard']);
          } else if (err) {
              this.router.navigate(['/dashboard'])
              console.log(err)
              alert('Error' + err);
          }
      })
  }

  private setSession(authResult): void {
      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())

      const scopes = authResult.scope || this.requestedScopes || ''

      localStorage.setItem('access_token', authResult.accessToken)
      localStorage.setItem('id_token', authResult.idToken)
      localStorage.setItem('expires_at', expiresAt)
      localStorage.setItem('scopes', JSON.stringify(scopes))

      this.scheduleRenewal()
  }

  public logout(): void {
      localStorage.removeItem('access_token')
      localStorage.removeItem('id_token')
      localStorage.removeItem('expires_at')
      localStorage.removeItem('scopes')
      this.unscheduleRenewal()

      this.router.navigate(['/'])
  }

  public isAuthenticated(): boolean {
      return !this.jwtHelper.isTokenExpired();
  }

  public userHasScopes(scopes: string[]): boolean {
      const grantedScopes = JSON.parse(localStorage.getItem('scopes')).split('')
      return scopes.every(scope => grantedScopes.includes(scope))
  }

  public renewToken() {
      this.auth0.checkSession({
          audience: AUTH_CONFIG.apiUrl
      }, (err, result) => {
          if(!err) {
              this.setSession(result);
          }
      })
  }

  public scheduleRenewal() {
    if(!this.isAuthenticated()) return

    const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'))

    const expiresIn$ = of(expiresAt).pipe(
        mergeMap(expiresAt => {
            const now = Date.now();

            // use delay in a timer to run refresh at proper time;
            // refresh 30 sec before expiry
            let refreshAt = expiresAt - (1000*30)
            return timer(Math.max(1, refreshAt - now))
        })
    )

    this.refreshSubscription = expiresIn$.subscribe(
        () => {
            this.renewToken();
            this.scheduleRenewal();
        }
    )
  }

  public unscheduleRenewal() {
      if(!this.refreshSubscription) return

      this.refreshSubscription.unsubscribe()
  }

  public getProfile(cb: (err: any, profile: any) => void): void {
      const accessToken = localStorage.getItem('access_token');
      if(!accessToken) {
          throw new Error('Access Token must exist')
      }

      const self = this
      this.auth0.client.userInfo(accessToken, (err, profile) => {
          if(profile) {
              self.userProfile = profile
          }
          cb(err, profile)
      })
  }
}