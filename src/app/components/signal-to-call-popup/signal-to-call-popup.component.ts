import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CallPopupComponent} from "../call-popup/call-popup.component";
import {CustomerModel} from "../../models/customer.model";
import {CallService} from "../../services/call.service";

@Component({
  selector: 'app-signal-to-call-popup',
  templateUrl: './signal-to-call-popup.component.html',
  styleUrls: ['./signal-to-call-popup.component.sass']
})
export class SignalToCallPopupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SignalToCallPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CustomerModel,
              private callService: CallService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  createCall() {
    this.dialog.open(CallPopupComponent);
    this.callService.setToCustomer(this.data)
    this.dialogRef.close()
  }

  cancelCall() {
    this.dialogRef.close()
  }
}
