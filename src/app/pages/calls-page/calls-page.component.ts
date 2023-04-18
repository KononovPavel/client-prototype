import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CallModel} from "../../models/call.model";
import {CallService} from "../../services/call.service";
import {extractCustomerId} from "../../utils/customer.utils";
import {Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-calls-page',
  templateUrl: './calls-page.component.html',
  styleUrls: ['./calls-page.component.sass']
})
export class CallsPageComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef,
              private callService: CallService) { }


  calls: CallModel[]

  showLoader: boolean

  customerId: string = extractCustomerId();

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.showLoader = true;
    this.callService.getAllCallsByCustomer(this.customerId).pipe(
      takeUntil(this.destroy$),
      tap((calls: CallModel[]) => {
        this.calls = calls;
        this.showLoader = false;
        this.cdr.markForCheck()
      })
    ).subscribe()
  }

}
