import {ProductPageComponent} from "./product-page.component";
import {NgModule} from "@angular/core";
import {ProductService} from "../../services/product.service";
import {CommonModule} from "@angular/common";
import {LoaderModule} from "../../components/loader/loader.module";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {RouterLinkWithHref} from "@angular/router";


const declarations = [ProductPageComponent];

@NgModule({
  declarations,
  imports: [CommonModule, LoaderModule, MatCardModule, MatButtonModule, RouterLinkWithHref],
  providers:[ProductService],
  exports:[]
})
export class ProductPageModule {
  static declare  = declarations;
}
