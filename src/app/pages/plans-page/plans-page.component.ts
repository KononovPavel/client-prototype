import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PlansService} from "../../services/plans.service";
import {PlanModel} from "../../models/plan.model";
import {LoaderService} from "../../services/loader.service";
import {Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-plans-page',
  templateUrl: './plans-page.component.html',
  styleUrls: ['./plans-page.component.sass']
})
export class PlansPageComponent implements OnInit {

  constructor(private planService: PlansService,
              private loaderService: LoaderService,
              private cdr: ChangeDetectorRef) { }

  _planes: PlanModel[];

  _isLoaderShown: boolean = false;

  private destroy$: Subject<void> = new Subject<void>()

  ngOnInit(): void {
    this._isLoaderShown = true;
    this.planService.getAllPlanes().pipe(
      takeUntil(this.destroy$),
      tap((plans: PlanModel[]) => {
        this._planes = plans;
        this._isLoaderShown = false;
        this.cdr.markForCheck()
      })
    ).subscribe()

  }

}
