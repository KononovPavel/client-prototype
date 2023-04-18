import {CallPopupComponent} from "./call-popup.component";
import {NgModule} from "@angular/core";
import {CallService} from "../../services/call.service";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";

const declarations = [CallPopupComponent];
@NgModule({
  declarations,
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule
  ],
  providers: [CallService]
})
export class CallPopupModule {
  static declare = declarations;
}
