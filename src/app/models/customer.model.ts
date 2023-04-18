import {ProductModel} from "./product.model";
import {PlanModel} from "./plan.model";

export interface CustomerModel {
  email: string;
  password: string
  token: string;
  actualBilling: number;
  actualPlan: PlanModel
  lastPlanes: PlanModel[];
  paymentMethods: customerPaymentMethod[];
  customerSensetiveData: customerSensetiveData;
  address: customerAddress
  planData: customerPlanData
  customerId: string;
  role: string;
  customerBanAndReason: customerBanAndReason;
  items: ProductModel[]
  actualPhoneNumber: string;
  documents: string[];
  balance: number;
  customerDocumentInfo: customerDocumentData
}


export interface customerSensetiveData {
  firstName: string;
  lastName: string;
  patronymic: string;
}


export interface customerAddress {
  country: string;
  city: string;
  home: string;
  room: string;
}

export interface customerPaymentMethod {
  number: string;
  name: string;
  cvv: string;
}

export interface customerPlanData {
  availableInternet: number;
  availableSms: number;
  availableCalls: number;
  availableMinutes: number;
}

export interface customerBanAndReason {
  isBan: boolean;
  reason: string;
}

export interface customerDocumentData {
  documentNumber: string
  documentCode: string
  identicalCode: string
  dateOfCreateDocument: Date | null
  dateOfExpiredDocument: Date | null
}
