import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {CustomerModel} from "../../models/customer.model";
import {Subject, takeUntil, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {LoaderService} from "../../services/loader.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit {

  constructor(private authService: AuthService,
              private loaderService: LoaderService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private cdr: ChangeDetectorRef) {
  }

  _switchFormsVisible: boolean = false;

  private destroy$: Subject<void> = new Subject<void>()

  loginForm: FormGroup = new FormGroup<any>({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  registrationForm: FormGroup = new FormGroup<any>(
    {
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    }
  )

  ngOnInit(): void {

  }

  signIn() {
    if (this.loginForm.valid) {
      this.authService.login({
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value
      } as CustomerModel)
        .pipe(
          takeUntil(this.destroy$),
          tap((value: { token: string, customer: CustomerModel } | HttpErrorResponse) => {
            if (value.hasOwnProperty('message')) {
              value = value as HttpErrorResponse;
              this._snackBar.open(value.message, "close", {verticalPosition: "top"});
            } else {
              value = value as { token: string, customer: CustomerModel }
              localStorage.setItem("access_token", value.token);
              localStorage.setItem("customerId", value.customer.customerId);
              localStorage.setItem("customerRole", value.customer.role);
              this.loaderService.isCustomerInfoUpdate.next(true);
              this.loaderService.isCustomerLogin$.next(true);
              const url = localStorage.getItem("url");
              if(url) {
                this.router.navigate([url]);
              }
              else  {
                this.router.navigate(['/plans'])
              }
            }
          })
        ).subscribe()
    }
  }

  registration() {
    if (this.registrationForm.valid) {
      this.authService.registration({
        email: this.registrationForm.controls['email'].value,
        password: this.registrationForm.controls['password'].value
      } as CustomerModel)
        .pipe(
          takeUntil(this.destroy$),
          tap((value: HttpErrorResponse | CustomerModel) => {
            if (value.hasOwnProperty('message')) {
              value = value as HttpErrorResponse;
              this._snackBar.open(value.message, "close", {verticalPosition: "top"});
            } else {
              this._snackBar.open("Your account was successfully created", "close", {verticalPosition: "top"});
              this._switchFormsVisible = !this._switchFormsVisible;
            }
          })
        ).subscribe()
    }
  }

  public hasError = (controlName: string, errorName: string, formGroup: FormGroup) => {
    return formGroup.controls[controlName].hasError(errorName);
  }

}
