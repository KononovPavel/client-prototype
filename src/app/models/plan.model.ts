import {PriceModel} from "./price.model";

export interface ServiceModel {
  id: string,
  price: PriceModel,
  icon: string,
  name: string,
  description: string,
  value: number,
}

export interface PlanModel {
  planId: string;
  name: string;
  images: string[];
  services: ServiceModel[];
  totalPrice: number;
}
