import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {PlanModel} from "../models/plan.model";
import {HttpClient} from "@angular/common/http";
import {APIEnum} from "../constants/API.enum";


@Injectable({providedIn: "root"})
export class PlansService {
  constructor(private httpClient: HttpClient) {
  }

  public getAllPlanes(): Observable<PlanModel[]> {
    return this.httpClient.get<PlanModel[]>(APIEnum.GET_ALL_PLANES).pipe();
  }

  public getPlanById(planId: string): Observable<PlanModel> {
    return this.httpClient.get<PlanModel>(APIEnum.GET_PLAN_BY_ID + "/" + planId).pipe();
  }


}
