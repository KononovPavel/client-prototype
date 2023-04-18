import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {extractCustomerId} from "../../utils/customer.utils";
import {NoteModel} from "../../models/note.model";
import {Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.sass']
})
export class NotificationPageComponent implements OnInit, OnDestroy {

  constructor(private cdr: ChangeDetectorRef,
              private customerService: CustomerService) { }

  private customerId: string = extractCustomerId();

  notifications: NoteModel[];

  showLoader: boolean;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.showLoader = true;
    this.customerService.getNotifications(this.customerId).pipe(
      takeUntil(this.destroy$),
      tap((notes: NoteModel[]) => {
        this.notifications = notes;
        this.showLoader = false;
      })
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.customerService.setVisibleNotification(this.customerId).pipe(takeUntil(this.destroy$)).subscribe()
  }

}
