import {ChatPageComponent} from "./chat-page.component";
import {NgModule} from "@angular/core";
import {ChatService} from "../../services/chat.service";
import {CommonModule, DatePipe} from "@angular/common";
import {LoaderModule} from "../../components/loader/loader.module";
import {MatCardModule} from "@angular/material/card";
import {CustomerService} from "../../services/customer.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


const declarations = [ChatPageComponent];

@NgModule({
  declarations,
  imports: [
    CommonModule,
    LoaderModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    DatePipe,
  ],
  providers: [ChatService, CustomerService],
  exports: []
})
export class ChatPageModule {
  static declare = declarations;
}
