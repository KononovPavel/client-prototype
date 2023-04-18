import {SignalToCallPopupComponent} from "./signal-to-call-popup.component";
import {NgModule} from "@angular/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {CallService} from "../../services/call.service";


const declarations = [SignalToCallPopupComponent]

@NgModule({
  declarations,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  providers:[CallService]
})
export class SignalToCallPopupModule {
  static declare = declarations
}
