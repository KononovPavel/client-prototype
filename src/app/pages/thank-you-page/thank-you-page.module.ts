import {NgModule} from "@angular/core";
import {ThankYouPageComponent} from "./thank-you-page.component";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";

const declarations = [ThankYouPageComponent]

@NgModule({
  declarations,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule
  ],
  providers:[]
})

export class ThankYouPageModule {
  static declare  = declarations;
}
