import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {OrderService} from "../../services/order.service";
import {PlansService} from "../../services/plans.service";
import {PlanModel} from "../../models/plan.model";
import {CustomerModel} from "../../models/customer.model";
import {OrderModel} from "../../models/order.model";
import {forkJoin, Subject, switchMap, take, takeUntil, tap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {CreateNewCustomerComponent} from "../../components/create-new-customer/create-new-customer.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateNewOrderComponent} from "../../components/create-new-order/create-new-order.component";
import {LoaderService} from "../../services/loader.service";
import {ProductModel} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {CreateNewProductComponent} from "../../components/create-new-product/create-new-product.component";
import {NoteModel} from "../../models/note.model";
import {
  CreateNotificationPopupComponent
} from "../../components/create-notification-popup/create-notification-popup.component";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.sass']
})
export class AdminPageComponent implements OnInit {

  constructor(private customerService: CustomerService,
              private orderService: OrderService,
              private cdr: ChangeDetectorRef,
              public dialog: MatDialog,
              private loaderService: LoaderService,
              private productService: ProductService,
              private planService: PlansService,
              private _snackBar: MatSnackBar,) {
  }


  plans: PlanModel[];

  customers: CustomerModel[];

  orders: OrderModel[];

  products: ProductModel[];

  notifications: NoteModel[]

  isShowLoader: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.findData()

    this.loaderService.updateAdminPage$.subscribe(value => this.findData());
  }

  createNewCustomer() {
    const dialogRef = this.dialog.open(CreateNewCustomerComponent);
  }

  createNewOrder() {
    const dialogRef = this.dialog.open(CreateNewOrderComponent);
  }

  acceptOrder(orderId: string) {
    this.orderService.acceptOrder(orderId).pipe(
      takeUntil(this.destroy$),
      tap((order:OrderModel)=> {
          this._snackBar.open(`Your order ${order.orderNumber} was accepted`, "close", {duration:2000, verticalPosition: "top"});
          this.findData();
          this.cdr.markForCheck();
      })
    ).subscribe()
  }

  private findData() {
    this.isShowLoader = true;
    forkJoin([this.customerService.getAllCustomers(), this.orderService.getAllOrders(), this.planService.getAllPlanes(), this.productService.getAllProducts(), this.customerService.getAllNotes()]).pipe(
      tap(([customers,orders, planes, products, notes]:[CustomerModel[],OrderModel[], PlanModel[], ProductModel[], NoteModel[]])=> {
        this.customers = customers;
        this.orders = orders.filter((order:OrderModel) => order.status === "PENDING");
        this.plans = planes;
        this.products = products;
        this.notifications = notes;
        this.isShowLoader = false;
      }),
      takeUntil(this.destroy$)
    )
      .subscribe()
  }

  createProduct() {
    const dialogRef = this.dialog.open(CreateNewProductComponent);
  }

  createNotification() {
      const dialogRef = this.dialog.open(CreateNotificationPopupComponent);
  }
}
