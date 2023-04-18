import {AdminPageComponent} from "./admin-page.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CustomerService} from "../../services/customer.service";
import {OrderService} from "../../services/order.service";
import {PlansService} from "../../services/plans.service";
import {MatTabsModule} from "@angular/material/tabs";
import {LoaderModule} from "../../components/loader/loader.module";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {RouterLinkWithHref} from "@angular/router";
import {LoaderService} from "../../services/loader.service";
import {ProductService} from "../../services/product.service";

const declarations = [AdminPageComponent];

@NgModule({
  declarations,
    imports: [CommonModule, MatTabsModule, LoaderModule, MatButtonModule, MatCardModule, RouterLinkWithHref],
  providers:[CustomerService, OrderService, PlansService, LoaderService,ProductService]
})
export class AdminPageModule {
  static declare = declarations;
}
