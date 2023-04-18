import {forwardRef, NgModule} from "@angular/core";
import {BuyPlanPageComponent} from "./buy-plan-page.component";
import {CommonModule} from "@angular/common";
import {PlansService} from "../../services/plans.service";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {RouterLinkWithHref} from "@angular/router";
import {LoaderModule} from "../../components/loader/loader.module";
import {MatStepperModule} from "@angular/material/stepper";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {CustomerService} from "../../services/customer.service";
import {LoaderService} from "../../services/loader.service";
import {OrderService} from "../../services/order.service";
import {ProductService} from "../../services/product.service";

const declarations = [BuyPlanPageComponent]

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterLinkWithHref,
    LoaderModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [PlansService,  {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}, CustomerService, LoaderService, OrderService, ProductService],
  declarations: declarations,
})

export class BuyPlanPageModule {
  static declare = declarations;
}
