import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CustomerService} from "../../services/customer.service";
import {extractCustomerId} from "../../utils/customer.utils";
import {FormControl, Validators} from "@angular/forms";
import {CustomerModel} from "../../models/customer.model";
import {Subject, takeUntil, tap} from "rxjs";
import {CallService} from "../../services/call.service";
import {CallPopupComponent} from "../call-popup/call-popup.component";

@Component({
  selector: 'app-create-call-popup',
  templateUrl: './create-call-popup.component.html',
  styleUrls: ['./create-call-popup.component.sass']
})
export class CreateCallPopupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateCallPopupComponent>,
              private router: Router,
              private _snackBar: MatSnackBar,
              private callService: CallService,
              public dialog: MatDialog,
              private customerService: CustomerService) {
  }


  customerId: string = extractCustomerId()

  phoneNumber = new FormControl('', [Validators.required])

  foundedCustomer: CustomerModel | null;

  customer: CustomerModel


  private destroy$: Subject<void> = new Subject<void>()

  ngOnInit(): void {
    if (this.customerId === '') {
      this.router.navigate(['/login'])
    }
    this.customerService.getCustomerById(this.customerId)
      .pipe(
        takeUntil(this.destroy$),
        tap((customer: CustomerModel) => {
          this.customer = customer
        })
        ).subscribe()
  }

  createCall() {
    if (this.phoneNumber.valid) {
      this.customerService.getCustomerByPhoneNumber(this.phoneNumber.value!).pipe(
        takeUntil(this.destroy$),
        tap((customer: CustomerModel | null) => {
          if (customer !== null) {
            this.foundedCustomer = customer;
            this.callService.signalToCallCustomer(this.foundedCustomer);
            this.callService.setFromCustomer(this.customer)
            const dialog = this.dialog.open(CallPopupComponent)
            this.dialogRef.close()
          } else {
            this.foundedCustomer = null;
            this._snackBar.open("Customer not found", "close", {duration: 1000, verticalPosition: 'top'})
          }
        })
      ).subscribe()
    }
  }
}
