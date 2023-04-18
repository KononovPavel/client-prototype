import {CreateNewProductComponent} from "./create-new-product.component";
import {NgModule} from "@angular/core";
import {ProductService} from "../../services/product.service";
import {MatDialogModule} from "@angular/material/dialog";
import {LoaderService} from "../../services/loader.service";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {AsyncPipe, CommonModule} from "@angular/common";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {LoaderModule} from "../loader/loader.module";

const declarations = [CreateNewProductComponent];

@NgModule({
  declarations,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    AsyncPipe,
    MatAutocompleteModule,
    LoaderModule,
    FormsModule
  ],
  providers:[ProductService, LoaderService]
})
export class CreateNewProductModule {
  static declare = declarations;
}
