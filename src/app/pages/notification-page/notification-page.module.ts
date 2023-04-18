import {NotificationPageComponent} from "./notification-page.component";
import {NgModule} from "@angular/core";
import {CustomerService} from "../../services/customer.service";
import {LoaderModule} from "../../components/loader/loader.module";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

const declarations = [NotificationPageComponent];

@NgModule({
  imports: [
    LoaderModule,
    MatCardModule,
    MatButtonModule,
    CommonModule
  ],
  exports:[],
  providers:[CustomerService],
  declarations
})
export class NotificationPageModule {
  static declare  = declarations;
}
