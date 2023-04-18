import {NgModule} from "@angular/core";
import {PlanComponent} from "./plan.component";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";


const declarations = [PlanComponent]

@NgModule({
  declarations: declarations,
  providers:[],
  exports:[PlanComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ]
})

export class PlanModule {
  static declare = declarations;
}
