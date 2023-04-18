import {CallsPageComponent} from "./calls-page.component";
import {NgModule} from "@angular/core";
import {CallService} from "../../services/call.service";
import {LoaderModule} from "../../components/loader/loader.module";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";


const declarations = [CallsPageComponent];

@NgModule({
  declarations,
  imports: [
    LoaderModule,
    CommonModule,
    MatCardModule
  ],
  providers: [CallService]
})
export class CallsPageModule {
  static declare = declarations;
}
