import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CustomerModel} from "../models/customer.model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {APIEnum} from "../constants/API.enum";
import {NoteModel} from "../models/note.model";


@Injectable({
  providedIn: "root"
})
export class CustomerService {
  constructor(private http: HttpClient) {

  }


  public updateCustomerInfo(customerId: string, customer: CustomerModel): Observable<CustomerModel> {
    return this.http.put<CustomerModel>(APIEnum.UPDATE_CUSTOMER_INFO + '/' + customerId, customer).pipe();
  }

  public getCustomerById(customerId: string): Observable<CustomerModel> {
    return this.http.get<CustomerModel>(APIEnum.GET_CUSTOMER_BY_ID + "/" + customerId).pipe()
  }

  public uploadCustomerImages(images: any, customerId: string): Observable<CustomerModel> {
   return this.http.post<CustomerModel>(APIEnum.UPDATE_CUSTOMER_INFO + "/" + customerId, images).pipe()
  }

  public getAllCustomers(): Observable<CustomerModel[]> {
    return this.http.get<CustomerModel[]>(APIEnum.GET_ALL_CUSTOMERS).pipe()
  }

  public createCustomer(customer: CustomerModel): Observable<CustomerModel> {
    return this.http.post<CustomerModel>(APIEnum.REGISTRATION, customer).pipe()
  }

  public createNotification(note: NoteModel): Observable<NoteModel> {
    return this.http.post<NoteModel>(APIEnum.NOTIFICATIONS, note).pipe()
  }

  public getNotifications(customerId: string): Observable<NoteModel[]> {
    return this.http.get<NoteModel[]>(APIEnum.NOTIFICATIONS + '/' + customerId).pipe()
  }

  public setVisibleNotification(customerId: string): Observable<string> {
    return this.http.put<string>(APIEnum.NOTIFICATIONS + '/' + customerId, {}).pipe()
  }

  public getCustomerByPhoneNumber(phoneNumber: string): Observable<CustomerModel | null> {
    return this.http.post<CustomerModel | null>(APIEnum.CUSTOMER_PHONE_NUMBER + '/' + phoneNumber, {}).pipe()
  }
}
