import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PlansService} from "../../services/plans.service";
import {PlanModel} from "../../models/plan.model";
import {Subject, switchMap, takeUntil, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {customerAddress, customerDocumentData, CustomerModel, customerSensetiveData} from "../../models/customer.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatStepper} from "@angular/material/stepper";
import {CustomerService} from "../../services/customer.service";
import {LoaderService} from "../../services/loader.service";
import {extractCustomerId} from "../../utils/customer.utils";
import {OrderService} from "../../services/order.service";
import {OrderModel} from "../../models/order.model";
import {ProductService} from "../../services/product.service";
import {ProductModel} from "../../models/product.model";

@Component({
  selector: 'app-buy-plan-page',
  templateUrl: './buy-plan-page.component.html',
  styleUrls: ['./buy-plan-page.component.sass']
})
export class BuyPlanPageComponent implements OnInit {

  constructor(private planService: PlansService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private _snackBar: MatSnackBar,
              private loaderService: LoaderService,
              private customerService: CustomerService,
              private orderService: OrderService,
              private productService: ProductService) {

  }

  _plan: PlanModel;

  _customer: CustomerModel;

  _product: ProductModel;

  private isPendingProducts: boolean = false;
  protected isPendingPlans: boolean = false;

  private destroy$: Subject<void> = new Subject<void>()

  sensetiveDataFormGroup = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    patronymic: new FormControl("")
  });

  addressFormGroup = new FormGroup({
    country: new FormControl("Belarus", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    home: new FormControl("", [Validators.required]),
    room: new FormControl("", [Validators.required]),
  });

  customerDocumentDataFormGroup = new FormGroup({
    documentNumber: new FormControl("", [Validators.required]),
    documentCode: new FormControl("", [Validators.required]),
    identicalCode: new FormControl("", [Validators.required]),
    dateOfCreateDocument: new FormControl(new Date(), [Validators.required]),
    dateOfExpiredDocument: new FormControl(new Date(), [Validators.required]),
  })

  _isDisabledSensDataButton: boolean = false;
  _isDisabledAddressDataButton: boolean = false;
  _isDisabledDocumentsDataButton: boolean = false;

  customerFiles: FileList;

  private itemId: string

  orderType: string

  ngOnInit(): void {

    this.itemId = this.route.snapshot.paramMap.get("planId")!;
    this.orderType = this.route.snapshot.paramMap.get("orderType")!;
    if(this.orderType && this.itemId) {
      if(this.orderType === 'PLAN') {
          this.planService.getPlanById(this.itemId).pipe(
            takeUntil(this.destroy$),
            tap((plan: PlanModel) => {
              this._plan = plan;
              this.cdr.markForCheck();
            })
          ).subscribe()
      }
      if(this.orderType === 'PRODUCT') {
          this.productService.getProductById(this.itemId).pipe(
            takeUntil(this.destroy$),
            tap((product: ProductModel) => {
              this._product = product;
              this.cdr.markForCheck();
            })
          ).subscribe()

      }
    }

    this.customerService.getCustomerById(extractCustomerId()).pipe(
      tap((customer: CustomerModel) => {
        this._customer = customer;
        this.fillCustomerData(customer)
        if(customer?.customerDocumentInfo && customer?.documents?.length) {
          this._isDisabledDocumentsDataButton = true;
        }
        if(customer?.customerSensetiveData) {
          this._isDisabledSensDataButton = true;
        }
        if(customer?.address) {
          this._isDisabledAddressDataButton = true;
        }
      }),
      switchMap((customer: CustomerModel) => this.orderService.getOrdersByCustomer(customer.customerId)),
      tap((orders:OrderModel[]) => {
        this.isPendingPlans = !!orders.find(order=> order.status === "PENDING" && order.orderType === "PLAN");
        this.isPendingProducts = !!orders.find(order=> order.status === "PENDING" && order.orderType === "PRODUCT");
      }),
      takeUntil(this.destroy$),
    ).subscribe()


  }

  saveCustomerSensetiveData(stepper: MatStepper) {
    if (this.sensetiveDataFormGroup.valid) {
      this.customerService.updateCustomerInfo(extractCustomerId(),
        {
          customerSensetiveData: {
            firstName: this.sensetiveDataFormGroup.controls['firstName'].value,
            lastName: this.sensetiveDataFormGroup.controls["lastName"].value,
            patronymic: this.sensetiveDataFormGroup.controls['patronymic'].value
          } as customerSensetiveData
        } as CustomerModel)
        .pipe(
          takeUntil(this.destroy$),
          tap(value => {
            this.loaderService.customerData$.next(value);
            this._snackBar.open("Your sensetive data was updated/registered", "close", {verticalPosition: "top", duration: 3000});
            stepper.next();
          })
        ).subscribe()

    } else {
      this._snackBar.open("You need to fill some fields", "close", {verticalPosition: "top", duration: 3000});
    }
  }

  saveCustomerAddress(stepper: MatStepper) {
    if (this.addressFormGroup.valid) {
      const updatedCustomerAddress = {
        address: {
          country: this.addressFormGroup.controls["country"].value,
          home: this.addressFormGroup.controls["home"].value,
          room: this.addressFormGroup.controls["room"].value,
          city: this.addressFormGroup.controls["city"].value
        }
      } as CustomerModel
      this.customerService.updateCustomerInfo(extractCustomerId(), updatedCustomerAddress).pipe(
        takeUntil(this.destroy$),
        tap(value => {
          this.loaderService.customerData$.next(value);
          stepper.next();
          this._snackBar.open("Your address was updated/registered", "close", {verticalPosition: "top", duration: 3000});
        })
      ).subscribe()

    } else {
      this._snackBar.open("You need to fill some fields", "close", {verticalPosition: "top", duration: 3000});
    }
  }

  saveCustomerDocuments(stepper: MatStepper) {
    if (this.customerDocumentDataFormGroup.valid && this.customerFiles?.length > 0) {
      const updatedCustomerDocuments = {
        customerDocumentInfo : {
          documentNumber: this.customerDocumentDataFormGroup.controls["documentNumber"].value,
          dateOfExpiredDocument: this.customerDocumentDataFormGroup.controls["dateOfExpiredDocument"].value,
          documentCode: this.customerDocumentDataFormGroup.controls["documentCode"].value,
          dateOfCreateDocument: this.customerDocumentDataFormGroup.controls["dateOfCreateDocument"].value,
          identicalCode: this.customerDocumentDataFormGroup.controls["identicalCode"].value
        } as customerDocumentData
      } as CustomerModel
      const uploadData = new FormData();
      for (let i = 0; i < this.customerFiles.length; i++) {
        uploadData.append("images", this.customerFiles[i]);
      }
      this.customerService.updateCustomerInfo(extractCustomerId(),updatedCustomerDocuments).pipe(
        switchMap(()=> this.customerService.uploadCustomerImages(uploadData, extractCustomerId())),
        takeUntil(this.destroy$),
        tap((value:CustomerModel)=> {
          this._snackBar.open("Your documents was updated/registered", "close", {verticalPosition: "top", duration:3000});
          this.loaderService.customerData$.next(value);
        })
      ).subscribe()
    }
    else {
      this._snackBar.open("You need to fill some fields", "close", {verticalPosition: "top"});
    }
  }

  handleFileInputChange(event: any): void {
    this.customerFiles = event.target.files
  }

  public hasError = (controlName: string, errorName: string, formGroup: FormGroup) => {
    return formGroup.controls[controlName].hasError(errorName);
  }

  fillCustomerData(customer: CustomerModel) {
    this.sensetiveDataFormGroup.setValue({
      firstName: customer.customerSensetiveData?.firstName ?? "",
      patronymic: customer.customerSensetiveData?.patronymic ?? "",
      lastName: customer.customerSensetiveData?.lastName ?? ""
    })

    this.addressFormGroup.setValue({
      room: customer.address?.room ?? "",
      city: customer.address?.city ?? "",
      home: customer.address?.home ?? "",
      country: customer.address?.country ?? ""
    })

    this.customerDocumentDataFormGroup.setValue({
      dateOfCreateDocument: customer.customerDocumentInfo?.dateOfCreateDocument ?? new Date,
      documentCode: customer.customerDocumentInfo?.documentCode ?? "",
      dateOfExpiredDocument: customer.customerDocumentInfo?.dateOfExpiredDocument ?? new Date,
      documentNumber: customer.customerDocumentInfo?.documentNumber ?? "",
      identicalCode: customer.customerDocumentInfo?.identicalCode ?? "",
    })

  }

  buyCustomerItem() {
    if(this.orderType === "PLAN") {
      if(this.isPendingPlans) {
        this._snackBar.open("Sorry, you are have order with plan and status pending", "close", {verticalPosition: 'top', duration: 2000})
      }
      else {
        this.orderService.createOrder(extractCustomerId(), "PLAN", this._plan).pipe(
          takeUntil(this.destroy$),
          tap((value: OrderModel)=> {
            this.router.navigate(['/thank-you'])
          })
        ).subscribe()
      }
    }
    if(this.orderType === "PRODUCT") {
      if(this.isPendingProducts) {
        this._snackBar.open("Sorry, you are have order with product and status pending", "close", {verticalPosition: 'top', duration: 2000})
      }
      else {
        this.orderService.createOrder(extractCustomerId(), "PRODUCT", this._product).pipe(
          takeUntil(this.destroy$),
          tap((value: OrderModel)=> {
            this.router.navigate(['/thank-you'])
          })
        ).subscribe()
      }
    }

  }

  backTo() {
   const url =  localStorage.getItem("url");
   this.router.navigate([`${url}`])
  }
}
