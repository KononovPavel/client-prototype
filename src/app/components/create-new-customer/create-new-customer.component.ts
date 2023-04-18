import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";
import {CustomerService} from "../../services/customer.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomerModel} from "../../models/customer.model";
import {Subject, switchMap, takeUntil, tap} from "rxjs";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-create-new-customer',
  templateUrl: './create-new-customer.component.html',
  styleUrls: ['./create-new-customer.component.sass']
})
export class CreateNewCustomerComponent implements OnInit {

  @Input()
  isPopupOpened: boolean = false;

  constructor(private dialogRef: MatDialogRef<CreateNewCustomerComponent>,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private loaderService: LoaderService,
              private customerService: CustomerService) { }

  customerFormData : FormGroup = new FormGroup<any>({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    patronymic: new FormControl('', ),
    country: new FormControl("Belarus", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    home: new FormControl("", [Validators.required]),
    room: new FormControl("", [Validators.required]),
    documentNumber: new FormControl("", [Validators.required]),
    documentCode: new FormControl("", [Validators.required]),
    identicalCode: new FormControl("", [Validators.required]),
    dateOfCreateDocument: new FormControl(new Date(), [Validators.required]),
    dateOfExpiredDocument: new FormControl(new Date(), [Validators.required]),
    })

  customerFiles: FileList;

  private destroy$: Subject<void> = new Subject<void>();


  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  createCustomer() {
    const uploadData = new FormData();
    for (let i = 0; i < this.customerFiles.length; i++) {
      uploadData.append("images", this.customerFiles[i]);
    }
    const newCustomer = this.fillDataOfCustomer();
    if(this.customerFormData.valid) {
      this.customerService.createCustomer(newCustomer).pipe(
        switchMap((customer: CustomerModel)=> this.customerService.uploadCustomerImages(uploadData, customer.customerId)),
        tap(value => {
          this._snackBar.open(`Your customer ${value?.customerSensetiveData?.firstName} ${value?.customerSensetiveData?.lastName} successfully created`, "close", {verticalPosition: "top", duration:3000});
          this.dialogRef.close();
          this.loaderService.updateAdminPage$.next(true);
        }),
        takeUntil(this.destroy$)
      ).subscribe()
    }
  }

  public hasError = (controlName: string, errorName: string, formGroup: FormGroup) => {
    return formGroup.controls[controlName].hasError(errorName);
  }

  handleFileInputChange(event: any): void {
    this.customerFiles = event.target.files
  }

  private fillDataOfCustomer(): CustomerModel {
    return {
      email: this.customerFormData.controls['email'].value,
      password: this.customerFormData.controls["password"].value,
      address: {
        country: this.customerFormData.controls["country"].value,
        room: this.customerFormData.controls["room"].value,
        home: this.customerFormData.controls["home"].value,
        city: this.customerFormData.controls["city"].value
      },
      customerSensetiveData: {
        firstName: this.customerFormData.controls["firstName"].value,
        lastName: this.customerFormData.controls["lastName"].value,
        patronymic: this.customerFormData.controls["patronymic"].value
      },
      customerDocumentInfo: {
        documentNumber: this.customerFormData.controls["documentNumber"].value,
        identicalCode: this.customerFormData.controls["identicalCode"].value,
        dateOfCreateDocument: this.customerFormData.controls["dateOfCreateDocument"].value,
        documentCode: this.customerFormData.controls["documentCode"].value,
        dateOfExpiredDocument: this.customerFormData.controls["dateOfExpiredDocument"].value
      },
    } as CustomerModel
  }
}
