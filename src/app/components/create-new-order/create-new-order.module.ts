import {CreateNewOrderComponent} from "./create-new-order.component";
import {NgModule} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {CustomerService} from "../../services/customer.service";
import {ProductService} from "../../services/product.service";
import {PlansService} from "../../services/plans.service";
import {AsyncPipe, CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OrderService} from "../../services/order.service";
import {LoaderService} from "../../services/loader.service";
import {MatFormFieldModule} from "@angular/material/form-field";


const declarations = [CreateNewOrderComponent]

@NgModule({
  imports: [
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    CommonModule,
    FormsModule,
    MatFormFieldModule
  ],
  providers:[CustomerService, ProductService, PlansService, OrderService, LoaderService],
  declarations
})
export class CreateNewOrderModule {
  static declare  = declarations;
}
