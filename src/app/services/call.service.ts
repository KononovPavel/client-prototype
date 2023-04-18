import {ElementRef, Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {CallModel} from "../models/call.model";
import {HttpClient} from "@angular/common/http";
import {APIEnum} from "../constants/API.enum";
import {Socket} from 'ngx-socket-io'
import {CustomerModel} from "../models/customer.model";
import {SignalingService} from "./signaling.service";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";


export interface CallCustomers {
  from: CustomerModel,
  to: CustomerModel
}

@Injectable({
  providedIn: 'root'
})
export class CallService {
  constructor(private http: HttpClient,
              private socket: Socket,
              private signalingService: SignalingService) {
  }

  configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  connection: RTCPeerConnection;

  public signalToCustomer$: BehaviorSubject<CustomerModel> = new BehaviorSubject<CustomerModel>({} as CustomerModel);
  public rejectCall$: BehaviorSubject<CustomerModel> = new BehaviorSubject<CustomerModel>({} as CustomerModel);
  public fromCustomer$: BehaviorSubject<CustomerModel> = new BehaviorSubject<CustomerModel>({} as CustomerModel);
  public toCustomer$: BehaviorSubject<CustomerModel> = new BehaviorSubject<CustomerModel>({} as CustomerModel);



  private async _initConnection(remoteVideo: ElementRef): Promise<void> {
    this.connection = new RTCPeerConnection(this.configuration);

    await this._getStreams(remoteVideo);

    this._registerConnectionListeners();
  }

  public async makeCall(remoteVideo: ElementRef): Promise<void> {
    await this._initConnection(remoteVideo);

    const offer = await this.connection.createOffer();

    await this.connection.setLocalDescription(offer);

    this.signalingService.sendMessage({ type: 'offer', offer });
  }


  public async handleOffer(
    offer: RTCSessionDescription,
    remoteVideo: ElementRef
  ): Promise<void> {
    await this._initConnection(remoteVideo);

    await this.connection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await this.connection.createAnswer();

    await this.connection.setLocalDescription(answer);

    this.signalingService.sendMessage({ type: 'answer', answer });
  }

  public async handleAnswer(answer: RTCSessionDescription): Promise<void> {
    await this.connection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  public async handleCandidate(candidate: RTCIceCandidate): Promise<void> {
    if (candidate) {
      await this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private _registerConnectionListeners(): void {
    this.connection.onicegatheringstatechange = (ev: Event) => {
      console.log(
        `ICE gathering state changed: ${this.connection.iceGatheringState}`
      );
    };

    this.connection.onconnectionstatechange = () => {
      console.log(
        `Connection state change: ${this.connection.connectionState}`
      );
    };

    this.connection.onsignalingstatechange = () => {
      console.log(`Signaling state change: ${this.connection.signalingState}`);
    };

    this.connection.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state change: ${this.connection.iceConnectionState}`
      );
    };
    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        const payload = {
          type: 'candidate',
          candidate: event.candidate.toJSON(),
        };
        this.signalingService.sendMessage(payload);
      }
    };
  }

  private async _getStreams(remoteVideo: ElementRef): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    if(remoteVideo.nativeElement) {
      remoteVideo.nativeElement.srcObject = remoteStream;
    }

    this.connection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    stream.getTracks().forEach((track) => {
      this.connection.addTrack(track, stream);
    });
  }


  public getAllCallsByCustomer(customerId: string): Observable<CallModel[]> {
    return this.http.get<CallModel[]>(APIEnum.CALL + '/' + customerId).pipe();
  }

  public signalToCallCustomer(customer: CustomerModel) {
    this.socket.emit('signalToCallCustomer', customer)
  }

  public getSignalToCustomer(): Observable<CustomerModel> {
    this.socket.on('signalToCallCustomer', (customer: CustomerModel) => {
      this.signalToCustomer$.next(customer)
    })
    return this.signalToCustomer$.asObservable()
  }

  setToCustomer(customer: CustomerModel) {
    this.socket.emit('setToCustomer', customer)
  }

  public getToCustomer(): Observable<CustomerModel> {
    this.socket.on('setToCustomer', (customer: CustomerModel) => {
      this.toCustomer$.next(customer)
    })
    return this.toCustomer$.asObservable()
  }

  public setFromCustomer(customer:CustomerModel) {
    this.socket.emit('setFromCustomer', customer)
  }

  getFromCustomer(): Observable<CustomerModel> {
    this.socket.on('setFromCustomer', (customer: CustomerModel) => {
      this.fromCustomer$.next(customer)
    })
    return this.fromCustomer$.asObservable()
  }



  public createCall(from: string, to: string, time: number): Observable<CallModel> {
   return this.http.post<CallModel>(APIEnum.CALL, {from: from, to: to, time: time}).pipe()
  }


}
