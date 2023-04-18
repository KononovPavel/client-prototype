import {MyOrdersPageComponent} from "./my-orders-page.component";
import {NgModule} from "@angular/core";
import {OrderService} from "../../services/order.service";
import {CommonModule, DatePipe} from "@angular/common";
import {LoaderModule} from "../../components/loader/loader.module";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {RouterLinkWithHref} from "@angular/router";



const declarations = [MyOrdersPageComponent]

@NgModule({
  declarations,
    imports: [CommonModule, LoaderModule, MatCardModule, DatePipe, MatButtonModule, RouterLinkWithHref],
  providers:[OrderService]
})
export class MyOrdersPageModule {
  static declare  = declarations;
}
