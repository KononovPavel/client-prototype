import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {CustomerModel, customerSensetiveData} from "../../models/customer.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, Subscription, switchMap, takeUntil, tap} from "rxjs";
import {ServiceModel} from "../../models/plan.model";
import {OrderModel} from "../../models/order.model";
import {OrderService} from "../../services/order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {extractCustomerId} from "../../utils/customer.utils";
import {MatDialog} from "@angular/material/dialog";
import {ImagePopupComponent} from "../../components/image-popup/image-popup.component";

interface progressData {
  name: string,
  actualValue: number,
  value: number,
  img: string
}

enum ServiceType {
  INTERNET = "INTERNET",
  CALLS = "CALLS",
  "MESSAGES" = "MESSAGES",
  "MINUTES" = "MINUTES"
}

enum PlanIds {
  PLAN1 = "423fa25f-f3f8-4009-932f-4ebcfd9e8af3",
  PLAN2 = "0056227b-b0a4-4e44-a754-528c5161171e"
}

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.sass']
})
export class DashboardPageComponent implements OnInit {

  constructor(private customerService: CustomerService,
              private orderService: OrderService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private cdr: ChangeDetectorRef,
              public dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  _customer: CustomerModel;

  private destroy$: Subject<void> = new Subject<void>();

  progressService: progressData[];

  customerPendingOrders: OrderModel[];

  orderHasPlan: boolean;

  isShowChangePlanVisible: boolean = false;

  private subscription: Subscription;

  private customerId: string;

  orders: OrderModel[];

  isShowLoader: boolean = false;

  customerRole: string;

  customerFiles: FileList;

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


  ngOnInit(): void {
    this.isShowLoader = true;
    this.subscription = this.route.params.pipe(
      tap((param) => {
        this.customerId = param['customerId'];
        const customerIdFromStorage = localStorage.getItem("customerId")
        this.customerRole = localStorage.getItem("customerRole")!;
        const role = localStorage.getItem("customerRole")
        if (customerIdFromStorage && role) {
          if (this.customerId !== customerIdFromStorage && role !== "ADMIN") {
            this.router.navigate(['/plans']);
            this._snackBar.open("Access denied", "close", {verticalPosition: "top", duration: 3000})
          }
        }
      }),
      switchMap(() => this.customerService.getCustomerById(this.customerId)),
      tap((customer: CustomerModel) => {
        this._customer = customer;
        this.fillCustomerData(customer)
        this.progressService = this.fillSpinnersData(customer);
        this.isShowChangePlanVisible = this._customer?.actualPlan && this._customer.actualPlan.planId === PlanIds.PLAN1;
      }),
      switchMap(() => this.orderService.getOrdersByCustomer(this.customerId)),
      tap((orders: OrderModel[]) => {
        this.customerPendingOrders = orders.filter((order: OrderModel) => order?.status == "PENDING");
        this.orderHasPlan = !!orders.find((order: OrderModel) => order.orderType === "PLAN" && order.status === "PENDING");
        this.cdr.markForCheck();
      })
    ).subscribe()
  }


  private fillSpinnersData(customer: CustomerModel): progressData[] {
    const progress: progressData[] = []
    customer?.actualPlan?.services?.forEach((service: ServiceModel) => {
      if (service.name === ServiceType.CALLS) {
        progress.push({
          actualValue: Math.floor(customer.planData.availableCalls),
          name: service.name,
          value: service.value,
          img: service.icon
        })
      }
      if (service.name === ServiceType.INTERNET) {
        progress.push({
          actualValue: Math.floor(customer.planData.availableInternet),
          name: service.name,
          value: service.value,
          img: service.icon
        })
      }
      if (service.name === ServiceType.MESSAGES) {
        progress.push({
          actualValue: Math.floor(customer.planData.availableSms),
          name: service.name,
          value: service.value,
          img: service.icon
        })
      }
      if (service.name === ServiceType.MINUTES) {
        progress.push({
          actualValue: Math.floor(customer.planData.availableMinutes),
          name: service.name,
          value: service.value,
          img: service.icon
        })
      }
    })

    return progress
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

  saveCustomerAddress() {
    if (this.addressFormGroup.valid) {
      const updatedCustomerAddress = {
        address: {
          country: this.addressFormGroup.controls["country"].value,
          home: this.addressFormGroup.controls["home"].value,
          room: this.addressFormGroup.controls["room"].value,
          city: this.addressFormGroup.controls["city"].value
        }
      } as CustomerModel
      this.customerService.updateCustomerInfo(this.customerId, updatedCustomerAddress).pipe(
        takeUntil(this.destroy$),
        tap(value => {
          this._snackBar.open("Your address was updated/registered", "close", {
            verticalPosition: "top",
            duration: 3000
          });
        })
      ).subscribe()

    } else {
      this._snackBar.open("You need to fill some fields", "close", {verticalPosition: "top", duration: 3000});
    }
  }

  saveCustomerSensetiveData() {
    if (this.sensetiveDataFormGroup.valid) {
      this.customerService.updateCustomerInfo(this.customerId,
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
            this._snackBar.open("Your sensetive data was updated/registered", "close", {
              verticalPosition: "top",
              duration: 3000
            });
          })
        ).subscribe()

    } else {
      this._snackBar.open("You need to fill some fields", "close", {verticalPosition: "top", duration: 3000});
    }
  }

  handleFileInputChange(event: any): void {
    this.customerFiles = event.target.files
  }

  uploadCustomerDocuments() {
    const uploadData = new FormData();
    for (let i = 0; i < this.customerFiles.length; i++) {
      uploadData.append("images", this.customerFiles[i]);
    }

    this.customerService.uploadCustomerImages(uploadData, this.customerId).pipe(
      takeUntil(this.destroy$),
      tap((customer: CustomerModel) => {
        this._snackBar.open("Your documents was uploaded", "close", {
          verticalPosition: "top",
          duration: 3000
        });
        this._customer = customer;
        this.cdr.markForCheck()

      })
    ).subscribe()
  }

  openFullImage(image: string) {
    this.dialog.open(ImagePopupComponent, {data: image})
  }

}
