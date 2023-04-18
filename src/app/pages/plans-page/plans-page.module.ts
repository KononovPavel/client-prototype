import {NgModule} from "@angular/core";
import {PlansPageComponent} from "./plans-page.component";
import {CommonModule} from "@angular/common";
import {PlanModule} from "../../components/plan/plan.module";
import {HttpClientModule} from "@angular/common/http";
import {PlansService} from "../../services/plans.service";
import {LoaderModule} from "../../components/loader/loader.module";
import {MatCardModule} from "@angular/material/card";


const declarations = [PlansPageComponent]

@NgModule({
  declarations: declarations,
  imports: [
    CommonModule,
    PlanModule,
    HttpClientModule,
    LoaderModule,
    MatCardModule
  ],
  exports: [],
  providers: [PlansService]
})

export class PlansPageModule {
  static declare = declarations;
}
