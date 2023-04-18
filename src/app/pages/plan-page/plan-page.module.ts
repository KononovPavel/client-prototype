import {NgModule} from "@angular/core";
import {PlanPageComponent} from "./plan-page.component";
import {PlansService} from "../../services/plans.service";
import {CommonModule} from "@angular/common";
import {LoaderModule} from "../../components/loader/loader.module";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {RouterLinkWithHref} from "@angular/router";
import {LoaderService} from "../../services/loader.service";
import {OrderService} from "../../services/order.service";


const declarations = [PlanPageComponent]

@NgModule({
  imports: [CommonModule, LoaderModule, MatCardModule, MatButtonModule, RouterLinkWithHref],
  declarations: declarations,
  providers: [PlansService, LoaderService, OrderService]
})

export class PlanPageModule {
  static declare = declarations;
}
