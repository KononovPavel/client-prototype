import { Component, OnInit } from '@angular/core';
import {OrderService} from "../../services/order.service";
import {OrderModel} from "../../models/order.model";
import {extractCustomerId} from "../../utils/customer.utils";
import {Subject, takeUntil, tap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-orders-page',
  templateUrl: './my-orders-page.component.html',
  styleUrls: ['./my-orders-page.component.sass']
})
export class MyOrdersPageComponent implements OnInit {

  constructor(private orderService: OrderService,
              private router: Router) { }

  _orders: OrderModel[]

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.orderService.getOrdersByCustomer(extractCustomerId()).pipe(
      takeUntil(this.destroy$),
      tap((orders: OrderModel[]) => {
        this._orders = orders;
      })
    ).subscribe()
  }


  backToDashboard() {
    this.router.navigate([`/dashboard/${extractCustomerId()}`])
  }
}
