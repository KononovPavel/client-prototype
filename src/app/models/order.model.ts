import {PlanModel} from "./plan.model";
import {ProductModel} from "./product.model";

export interface OrderModel {
  orderId: string;
  orderNumber: number;
  linkToCustomer: string;
  status: string;
  when_created: Date
  who_accept: string
  orderType: string;
  plan: PlanModel;
  product: ProductModel;
}
