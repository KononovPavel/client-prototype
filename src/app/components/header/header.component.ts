import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject, takeUntil, tap} from "rxjs";
import {LoaderService} from "../../services/loader.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateCallPopupComponent} from "../create-call-popup/create-call-popup.component";
import {CallService} from "../../services/call.service";
import {extractCustomerId} from "../../utils/customer.utils";
import {CustomerModel} from "../../models/customer.model";
import {SignalToCallPopupComponent} from "../signal-to-call-popup/signal-to-call-popup.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  @Output()
  toogleLeftBar: EventEmitter<void> = new EventEmitter<void>()

  constructor(private loaderService: LoaderService,
              private cdr: ChangeDetectorRef,
              private callService: CallService,
              public dialog: MatDialog) { }

  isCustomerLogin: boolean

  private destroy$:Subject<void> = new Subject<void>()

  private customerId: string = extractCustomerId()

  ngOnInit(): void {
    this.loaderService.getCustomerLoginSubject().pipe(
      takeUntil(this.destroy$),
      tap(value => {
        this.isCustomerLogin = value;
        this.cdr.markForCheck()
      })
    ).subscribe()

    this.callService.getSignalToCustomer().pipe(
      takeUntil(this.destroy$),
      tap((customer: CustomerModel) => {
        if(this.customerId === customer.customerId) {
          this.dialog.open(SignalToCallPopupComponent, {data:customer})
        }
      })
    ).subscribe()

  }

  createCall() {
    const dialog = this.dialog.open(CreateCallPopupComponent);
  }



}
