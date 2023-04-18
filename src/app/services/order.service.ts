import {Injectable} from "@angular/core";
import {ProductModel} from "../models/product.model";
import {Observable} from "rxjs";
import {OrderModel} from "../models/order.model";
import {HttpClient} from "@angular/common/http";
import {APIEnum} from "../constants/API.enum";
import {PlanModel} from "../models/plan.model";


@Injectable({
  providedIn:'root'
})
export class OrderService {
  constructor(private http: HttpClient) {
  }

  public createOrder(customerId: string, orderType: string, item: PlanModel | ProductModel): Observable<OrderModel> {
    const url = APIEnum.CREATE_ORDER + '/' + customerId + "/" + orderType
    return this.http.post<OrderModel>(url, item).pipe();
  }

  public getOrdersByCustomer(customerId: string): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(APIEnum.GET_ORDER_BY_CUSTOMER + '/' + customerId).pipe();
  }

  public getPendingOrdersByCustomer(customerId: string): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(APIEnum.GET_ORDER_BY_CUSTOMER + '/pending/' + customerId).pipe();
  }

  public getAllOrders(): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(APIEnum.GET_ALL_ORDERS).pipe()
  }

  public acceptOrder(orderId: string): Observable<OrderModel> {
    return this.http.put<OrderModel>(APIEnum.CREATE_ORDER + '/' + orderId,null).pipe()
  }
}
