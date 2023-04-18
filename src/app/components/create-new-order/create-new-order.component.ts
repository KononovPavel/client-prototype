import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {CustomerService} from "../../services/customer.service";
import {ProductService} from "../../services/product.service";
import {PlansService} from "../../services/plans.service";
import {CustomerModel} from "../../models/customer.model";
import {PlanModel} from "../../models/plan.model";
import {ProductModel} from "../../models/product.model";
import {forkJoin, map, Observable, startWith, Subject, takeUntil, tap} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrderService} from "../../services/order.service";
import {OrderModel} from "../../models/order.model";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-create-new-order',
  templateUrl: './create-new-order.component.html',
  styleUrls: ['./create-new-order.component.sass']
})
export class CreateNewOrderComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateNewOrderComponent>,
              private customerService: CustomerService,
              private productService: ProductService,
              private _snackBar: MatSnackBar,
              private orderService: OrderService,
              private loaderService: LoaderService,
              private planService: PlansService) {
  }

  customers: CustomerModel[];

  plans: PlanModel[];

  products: ProductModel[];

  customerControl = new FormControl<CustomerModel>({} as CustomerModel, [Validators.required]);
  filteredCustomers: Observable<CustomerModel[]>

  productControl = new FormControl<ProductModel>({} as ProductModel);
  filteredProducts: Observable<ProductModel[]>

  planControl = new FormControl<PlanModel>({} as PlanModel);
  filteredPlans: Observable<PlanModel[]>

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    forkJoin([this.customerService.getAllCustomers(), this.productService.getAllProducts(), this.planService.getAllPlanes()]).pipe(
      tap(([customers, products, planes]: [CustomerModel[], ProductModel[], PlanModel[]]) => {
        this.customers = customers;
        this.products = products;
        this.plans = planes;
      }),
      takeUntil(this.destroy$)
    ).subscribe()

    this.filteredCustomers = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.customerSensetiveData?.lastName;
        return name ? this._filterCustomers(name as string) : this.customers.slice();
      })
    )

    this.filteredProducts = this.productControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterProducts(name as string) : this.products.slice();
      })
    )

    this.filteredPlans = this.planControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterPlans(name as string) : this.plans.slice();
      })
    )

  }

  createNewOrder() {
    if (this.customerControl.value?.customerId) {
      if (!!this.planControl.value?.planId && !!this.productControl.value?.productId) {
        this._snackBar.open("Please, choose 1 value", "close", {verticalPosition: 'top', duration: 2000})
      } else {
        if (this.planControl.value?.planId) {
              this.orderService.createOrder(this.customerControl.value?.customerId, "PLAN", this.planControl.value).pipe(
                takeUntil(this.destroy$),
                tap((order: OrderModel)=> {
                  this._snackBar.open(`Order with ${order.plan.name} was created`, "close", {verticalPosition: 'top', duration: 2000});
                  this.dialogRef.close();
                  this.loaderService.updateAdminPage$.next(true);
                })
              ).subscribe()
        }
        if (this.productControl.value?.productId) {
          this.orderService.createOrder(this.customerControl.value?.customerId, "PRODUCT", this.productControl.value).pipe(
            takeUntil(this.destroy$),
            tap((order: OrderModel)=> {
              this._snackBar.open(`Order with ${order.product.name} was created`, "close", {verticalPosition: 'top', duration: 2000});
              this.dialogRef.close();
              this.loaderService.updateAdminPage$.next(true);
            })
          ).subscribe()
        }
      }
    } else {
      this._snackBar.open("Please, choose customer account", "close", {verticalPosition: 'top', duration: 2000})
    }
  }

  handleCustomerEvent(event: any) {
    console.log(event)
  }

  displayCustomerFn(user: CustomerModel): string {
    return user && !!user?.customerSensetiveData ? `${user?.customerSensetiveData.firstName} ${user?.customerSensetiveData.lastName}` : user.email;
  }

  displayProductFn(product: ProductModel): string {
    return product && !!product?.name ? `${product.name} ${product.price}$` : '';
  }

  displayPlanFn(plan: PlanModel): string {
    return plan && !!plan?.name ? `${plan.name} ${plan.totalPrice}$` : '';
  }

  private _filterCustomers(name: string): CustomerModel[] {
    const filterValue = name.toLowerCase();
    return this.customers.filter(customer => customer?.customerSensetiveData?.lastName.toLowerCase().includes(filterValue));
  }

  private _filterProducts(name: string): ProductModel[] {
    const filterValue = name.toLowerCase();
    return this.products.filter(product => product?.name?.toLowerCase().includes(filterValue));
  }

  private _filterPlans(name: string): PlanModel[] {
    const filterValue = name.toLowerCase();
    return this.plans.filter(plan => plan?.name?.toLowerCase().includes(filterValue));
  }
}
