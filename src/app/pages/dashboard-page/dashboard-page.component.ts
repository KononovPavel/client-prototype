import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {CustomerModel} from "../../models/customer.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject, Subscription, switchMap, takeUntil, tap} from "rxjs";
import {ServiceModel} from "../../models/plan.model";
import {OrderModel} from "../../models/order.model";
import {OrderService} from "../../services/order.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
        progress.push({actualValue: Math.floor(customer.planData.availableCalls), name: service.name, value: service.value, img: service.icon})
      }
      if (service.name === ServiceType.INTERNET) {
        progress.push({actualValue: Math.floor(customer.planData.availableInternet), name: service.name, value: service.value, img: service.icon})
      }
      if (service.name === ServiceType.MESSAGES) {
        progress.push({actualValue: Math.floor(customer.planData.availableSms), name: service.name, value: service.value, img: service.icon})
      }
      if (service.name === ServiceType.MINUTES) {
        progress.push({actualValue: Math.floor(customer.planData.availableMinutes), name: service.name, value: service.value, img: service.icon})
      }
    })

    return progress
  }


}
