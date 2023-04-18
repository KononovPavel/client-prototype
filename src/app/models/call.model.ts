import {CustomerModel} from "./customer.model";

export interface CallModel {
  callId: string;
  from: CustomerModel;
  to: CustomerModel;
  time: string;
}
