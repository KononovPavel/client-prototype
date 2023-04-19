import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {CustomerService} from "../../services/customer.service";
import {LoaderService} from "../../services/loader.service";
import {Subject, takeUntil, tap} from "rxjs";
import {NoteModel} from "../../models/note.model";


@Component({
  selector: 'app-create-notification-popup',
  templateUrl: './create-notification-popup.component.html',
  styleUrls: ['./create-notification-popup.component.sass']
})
export class CreateNotificationPopupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateNotificationPopupComponent>,
              private loaderService: LoaderService,
              private customerService: CustomerService) {
  }


  subject = new FormControl('', [Validators.required])
  description = new FormControl('', [Validators.required]);

  private destroy$: Subject<void> = new Subject<void>()

  ngOnInit(): void {
  }

  createNewNote() {
    if (this.description.valid && this.subject.valid) {
      this.customerService.createNotification({
        subject: this.subject.value,
        description: this.description.value
      } as NoteModel).pipe(
        takeUntil(this.destroy$),
        tap(()=> {
          this.loaderService.updateAdminPage$.next(true);
          this.dialogRef.close()
        })
      ).subscribe()
    }
  }
}
