import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Socket} from "ngx-socket-io";



@Injectable({
  providedIn: 'root',
})
export class SignalingService {
  constructor(private socket: Socket) {
  }

  getMessages(): Observable<any> {
    return this.socket.fromEvent('call');
  }

  sendMessage(payload: any): void {
    this.socket.emit('send-call', payload);
  }
}
