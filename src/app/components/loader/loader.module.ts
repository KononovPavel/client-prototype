import {NgModule} from "@angular/core";
import {LoaderComponent} from "./loader.component";
import {CommonModule} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

const declarations = [LoaderComponent]

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [
    LoaderComponent
  ],
  declarations: declarations,
})

export class LoaderModule {
  static declare  = declarations;
}
