import {Component, Input, OnInit} from '@angular/core';
import {PlanModel} from "../../models/plan.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.sass']
})
export class PlanComponent implements OnInit {

  constructor(private router: Router) { }

  @Input()
  plan: PlanModel

  ngOnInit(): void {

  }

  _openPlanDetails(planId: string): void {
    this.router.navigate([`/plan/${planId}`]);
  }

}
