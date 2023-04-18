import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoaderService} from "../../services/loader.service";
import {CustomerModel} from "../../models/customer.model";
import {Subject, takeUntil, tap} from "rxjs";
import {Router} from "@angular/router";
import {extractCustomerId, extractCustomerRole} from "../../utils/customer.utils";

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.sass']
})
export class RightBarComponent implements OnInit {

  @Output()
  toogleLeftBar: EventEmitter<void> = new EventEmitter<void>()

  _customerData: CustomerModel;

  private destroy$: Subject<void> = new Subject<void>()

  _customerRole: string;

  isCustomerLogin: boolean


  constructor(private dialog: MatDialog,
              private router: Router,
              private cdr: ChangeDetectorRef,
              private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.isCustomerInfoUpdate
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this._customerRole = extractCustomerRole();
        this.cdr.markForCheck();
      })

    this.loaderService.getCustomerLoginSubject().pipe(
      takeUntil(this.destroy$),
      tap(value => {
        this.isCustomerLogin = value;
        this.cdr.markForCheck()
      })
    ).subscribe()
  }

  _logout() {
    localStorage.clear();
    this.toogleLeftBar.emit();
    this.router.navigate(['/login']);
  }

  login() {
    this.router.navigate(['/login']);
    this.toogleLeftBar.emit();
  }

  customerLink() {
    return extractCustomerId();
  }
}
