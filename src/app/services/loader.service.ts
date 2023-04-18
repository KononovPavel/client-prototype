import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {CustomerModel} from "../models/customer.model";


@Injectable({providedIn: "root"})
export class LoaderService {

  constructor() {
  }

  public isCustomerInfoUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public customerData$: BehaviorSubject<CustomerModel> = new BehaviorSubject({} as CustomerModel);

  public linkToRedirect$: BehaviorSubject<string> = new BehaviorSubject('');

  public updateAdminPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isCustomerLogin$: BehaviorSubject<boolean> = new BehaviorSubject(false);


  public getCustomerLoginSubject = (): Observable<boolean> => this.isCustomerLogin$.asObservable();
}
