import { Injectable } from "@angular/core";
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
 
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/register']);
      return false;
    }
  }
}