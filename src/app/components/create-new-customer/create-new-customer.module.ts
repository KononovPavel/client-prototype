import {NgModule} from "@angular/core";
import {CreateNewCustomerComponent} from "./create-new-customer.component";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {LoaderService} from "../../services/loader.service";
import {CustomerService} from "../../services/customer.service";
import {AuthService} from "../../services/auth.service";


const declarations = [CreateNewCustomerComponent]

@NgModule({
  declarations: declarations,
  providers: [LoaderService, CustomerService,AuthService],
  exports: [],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule
  ]
})

export class CreateNewCustomerModule {
  static declare = declarations;
}
