import {NgModule} from "@angular/core";
import {RightBarComponent} from "./right-bar.component";
import {MatButtonModule} from "@angular/material/button";
import {RouterLinkWithHref} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoaderService} from "../../services/loader.service";

const declarations = [RightBarComponent]

@NgModule({
  declarations: declarations,
  imports: [
    MatButtonModule,
    RouterLinkWithHref,
    CommonModule,
    MatDialogModule
  ],
  providers: [MatDialog, LoaderService],
  exports: [RightBarComponent]
})

export class RightBarModule {
  static declare = declarations;
}
