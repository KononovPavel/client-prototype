import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {BehaviorSubject, catchError, map, Observable, of, Subject, takeUntil, tap} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from "../services/loader.service";
import {CustomerModel} from "../models/customer.model";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService,
              private loaderService: LoaderService,
              private _snackBar: MatSnackBar) {
  }

  private isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  canActivate(): any {
    const token = localStorage.getItem("access_token") || '';
    return this.authService.auth(token).pipe(map((response: { token: string; customer: CustomerModel } | HttpErrorResponse) => {
      if (response.hasOwnProperty('token')) {
        response = response as { token: string; customer: CustomerModel };
        this.loaderService.customerData$.next(response.customer);
        this.loaderService.isCustomerLogin$.next(true)
        return true;
      } else {
        response = response as HttpErrorResponse;
        this.router.navigate(['/login']);
        this._snackBar.open(response.message, 'close', {verticalPosition: "top", duration:3000});
        localStorage.clear();
        return of(false);
      }
    }))
  }
}
