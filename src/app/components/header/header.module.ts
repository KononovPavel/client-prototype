import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "./header.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLinkWithHref} from "@angular/router";
import {LoaderService} from "../../services/loader.service";
import { MatDialogModule} from "@angular/material/dialog";
import {CallService} from "../../services/call.service";

const declarations = [HeaderComponent]

@NgModule({
  declarations: declarations,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLinkWithHref,
    MatDialogModule
  ],
  exports: [HeaderComponent],
  providers: [LoaderService, CallService]
})
export class HeaderModule {
  static declare = declarations;
}
