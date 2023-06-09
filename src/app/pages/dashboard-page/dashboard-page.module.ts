import {DashboardPageComponent} from "./dashboard-page.component";
import {NgModule} from "@angular/core";
import {LoaderService} from "../../services/loader.service";
import {CustomerService} from "../../services/customer.service";
import {CommonModule, DatePipe} from "@angular/common";
import {LoaderModule} from "../../components/loader/loader.module";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {RouterLinkWithHref} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";


const declarations = [DashboardPageComponent]

@NgModule({
  declarations,
  imports: [CommonModule, LoaderModule, MatCardModule, MatProgressSpinnerModule, DatePipe, MatButtonModule, RouterLinkWithHref, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  providers:[LoaderService, CustomerService,
    OrderService]
})
export class DashboardPageModule {
  static declare  = declarations;
}
