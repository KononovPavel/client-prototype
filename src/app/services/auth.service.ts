import {Injectable} from "@angular/core";
import {CustomerModel} from "../models/customer.model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {APIEnum} from "../constants/API.enum";
import {Observable} from "rxjs";


@Injectable( {
  providedIn: 'root'
})

export class AuthService {
  constructor(private httpClient: HttpClient) {
  }


  public registration(customer: CustomerModel): Observable<CustomerModel | HttpErrorResponse> {
    return this.httpClient.post<CustomerModel | HttpErrorResponse>(APIEnum.REGISTRATION, customer).pipe();
  }

  public login(customer: CustomerModel): Observable<{ token: string, customer: CustomerModel } | HttpErrorResponse> {
    return this.httpClient.post<{ token: string,customer: CustomerModel } | HttpErrorResponse>(APIEnum.LOGIN, customer).pipe();
  }

  public auth(token: string): Observable<{ token: string; customer: CustomerModel } | HttpErrorResponse> {
    return this.httpClient.get<{ token: string; customer: CustomerModel } | HttpErrorResponse>(APIEnum.AUTH_GET, {headers: {"Authorization": token}}).pipe();
  }
}
