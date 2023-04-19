import {CreateNotificationPopupComponent} from "./create-notification-popup.component";
import {NgModule} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {CustomerService} from "../../services/customer.service";


const declarations = [CreateNotificationPopupComponent];

@NgModule({
  declarations,
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  providers:[CustomerService]
})
export class CreateNotificationPopupModule {
  static declare  = declarations;
}
