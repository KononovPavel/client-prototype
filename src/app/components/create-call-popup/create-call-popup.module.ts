import {NgModule} from "@angular/core";
import {CreateCallPopupComponent} from "./create-call-popup.component";
import {CustomerService} from "../../services/customer.service";
import {CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from "@angular/material/card";
import {CallService} from "../../services/call.service";

const declarations = [CreateCallPopupComponent]

@NgModule({
  declarations,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule
  ],
  providers: [CustomerService, CallService]
})
export class CreateCallPopupModule {
  static declare = declarations
}
