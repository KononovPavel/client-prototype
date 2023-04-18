import {ShopPageComponent} from "./shop-page.component";
import {NgModule} from "@angular/core";
import {ProductService} from "../../services/product.service";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {LoaderModule} from "../../components/loader/loader.module";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {RouterLinkWithHref} from "@angular/router";

const declarations = [ShopPageComponent];

@NgModule({
  declarations,
  imports: [CommonModule, MatCardModule, LoaderModule, MatTabsModule, MatButtonModule, RouterLinkWithHref],
  exports:[],
  providers:[ProductService]
})
export class ShopPageModule {
  static declare  = declarations;
}
