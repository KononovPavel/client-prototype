import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PlansService} from "../../services/plans.service";
import {PlanModel} from "../../models/plan.model";
import {ActivatedRoute, Router} from "@angular/router";
import { Subject, takeUntil, tap} from "rxjs";
import {LoaderService} from "../../services/loader.service";
import {OrderModel} from "../../models/order.model";
import {OrderService} from "../../services/order.service";

@Component({
  selector: 'app-plan-page',
  templateUrl: './plan-page.component.html',
  styleUrls: ['./plan-page.component.sass']
})
export class PlanPageComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef,
              private planService: PlansService,
              private router: Router,
              private loaderService: LoaderService,
              private route: ActivatedRoute) {
  }

  _plan: PlanModel;

  pendingOrdersWithPlan: OrderModel[]

  private destroy$: Subject<void> = new Subject<void>()

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get("planId");
    if(planId) {
      this.planService.getPlanById(planId).pipe(
        takeUntil(this.destroy$),
        tap((plan:PlanModel) => {
          this._plan = plan;
          this.cdr.markForCheck();

        })
      ).subscribe()
    }
  }

  _redirectToBuyPlan(planId: string): void {
    this.router.navigate([`/plan/buy/PLAN/${planId}`])
    localStorage.setItem("url", `/plan/buy/PLAN/${planId}`);
  }

}
