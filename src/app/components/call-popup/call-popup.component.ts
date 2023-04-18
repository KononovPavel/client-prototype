import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CallService} from "../../services/call.service";
import {SignalingService} from "../../services/signaling.service";
import {MatDialogRef} from "@angular/material/dialog";
import {CustomerModel} from "../../models/customer.model";
import {Subject, takeUntil, tap} from "rxjs";
import {extractCustomerId} from "../../utils/customer.utils";

@Component({
  selector: 'app-call-popup',
  templateUrl: './call-popup.component.html',
  styleUrls: ['./call-popup.component.sass']
})
export class CallPopupComponent implements OnInit, AfterViewInit {

  constructor(private callService: CallService,
              private signalingService: SignalingService,
              private dialogRef: MatDialogRef<CallPopupComponent>,) {

  }

  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  toCustomer: CustomerModel;
  fromCustomer: CustomerModel;
  time: number = 0;
  customerId: string = extractCustomerId()

  timer: any

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {

  }


  private async _handleMessage(data: any): Promise<void> {
    switch (data?.type) {
      case 'offer':
        await this.callService.handleOffer(data?.offer, this.remoteVideo);
        break;

      case 'answer':
        await this.callService.handleAnswer(data?.answer);
        break;

      case 'candidate':
        await this.callService.handleCandidate(data?.candidate);
        break;

      default:
        break;
    }
  }

  public async makeCall(): Promise<void> {
    await this.callService.makeCall(this.remoteVideo);
  }

  ngAfterViewInit(): void {
    this.makeCall().then()
    this.signalingService.getMessages().subscribe(payload => this._handleMessage(payload));

    this.timer = setInterval(()=> {
      this.time = this.time + 1;
    }, 1000)
    this.callService.getToCustomer()
      .pipe(
        takeUntil(this.destroy$),
        tap(toCustomer => {
          this.toCustomer = toCustomer;
          console.log('toCustomer')
          console.log(toCustomer)
        })
      ).subscribe()

    this.callService.getFromCustomer()
      .pipe(
        takeUntil(this.destroy$),
        tap(fromCustomer => {
          this.fromCustomer = fromCustomer;
          console.log('fromCustomer')
          console.log(fromCustomer)
        })
      ).subscribe()


  }

  cancelCall() {
    if(this.toCustomer?.customerId && this.fromCustomer?.customerId) {
      this.callService.createCall(this.fromCustomer.customerId, this.toCustomer.customerId, this.time).pipe(
        takeUntil(this.destroy$),
        tap(()=> {
          this.callService.setFromCustomer({} as CustomerModel);
          this.callService.setToCustomer({} as CustomerModel);
        })
      ).subscribe()
    }
    clearInterval(this.timer)
    this.dialogRef.close()
  }
}
