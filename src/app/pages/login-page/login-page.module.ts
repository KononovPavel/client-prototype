import {NgModule} from "@angular/core";
import {LoginPageComponent} from "./login-page.component";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {BrowserModule} from "@angular/platform-browser";
import {RouterLinkWithHref} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {LoaderService} from "../../services/loader.service";

const declarations = [LoginPageComponent]

@NgModule({
  declarations:declarations,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    BrowserModule,
    RouterLinkWithHref
  ],
  exports:[
    BrowserAnimationsModule,
    FormsModule
  ],
  providers:[AuthService,LoaderService]
})

export class LoginPageModule {
  static declare  = declarations;
}
