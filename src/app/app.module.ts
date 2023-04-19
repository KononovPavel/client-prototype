import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderModule} from "./components/header/header.module";
import {RightBarModule} from "./components/right-bar/right-bar.module";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule, Routes} from "@angular/router";
import {PlansPageComponent} from "./pages/plans-page/plans-page.component";
import {PlansPageModule} from "./pages/plans-page/plans-page.module";
import {AuthGuard} from "./guards/auth.guard";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {LoaderService} from "./services/loader.service";
import {CommonModule} from "@angular/common";
import {PlanPageComponent} from './pages/plan-page/plan-page.component';
import {PlanPageModule} from "./pages/plan-page/plan-page.module";
import {BuyPlanPageModule} from "./pages/buy-plan-page/buy-plan-page.module";
import {BuyPlanPageComponent} from "./pages/buy-plan-page/buy-plan-page.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatNativeDateModule} from "@angular/material/core";
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {LoginPageModule} from "./pages/login-page/login-page.module";
import {ThankYouPageModule} from "./pages/thank-you-page/thank-you-page.module";
import {ThankYouPageComponent} from "./pages/thank-you-page/thank-you-page.component";
import {MyOrdersPageComponent} from './pages/my-orders-page/my-orders-page.component';
import {MyOrdersPageModule} from "./pages/my-orders-page/my-orders-page.module";
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {DashboardPageModule} from "./pages/dashboard-page/dashboard-page.module";
import {AdminPageComponent} from './pages/admin-page/admin-page.component';
import {AdminPageModule} from "./pages/admin-page/admin-page.module";
import {MatTabsModule} from "@angular/material/tabs";
import {CreateNewCustomerModule} from "./components/create-new-customer/create-new-customer.module";
import {CreateNewOrderModule} from "./components/create-new-order/create-new-order.module";
import {CreateNewProductModule} from "./components/create-new-product/create-new-product.module";
import {ShopPageComponent} from './pages/shop-page/shop-page.component';
import {ShopPageModule} from "./pages/shop-page/shop-page.module";
import {ProductPageComponent} from './pages/product-page/product-page.component';
import {ProductPageModule} from "./pages/product-page/product-page.module";
import {NotificationPageComponent} from './pages/notification-page/notification-page.component';
import {NotificationPageModule} from "./pages/notification-page/notification-page.module";
import {ChatPageComponent} from './pages/chat-page/chat-page.component';
import {ChatPageModule} from "./pages/chat-page/chat-page.module";
import {CallsPageComponent} from './pages/calls-page/calls-page.component';
import {CallsPageModule} from "./pages/calls-page/calls-page.module";
import {CreateCallPopupModule} from "./components/create-call-popup/create-call-popup.module";
import {CallPopupModule} from "./components/call-popup/call-popup.module";
import { SignalToCallPopupComponent } from './components/signal-to-call-popup/signal-to-call-popup.component';
import {SignalToCallPopupModule} from "./components/signal-to-call-popup/signal-to-call-popup.module";
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ImagePopupComponent } from './components/image-popup/image-popup.component';
import {ImagePopupModule} from "./components/image-popup/image-popup.module";
import { CreateNotificationPopupComponent } from './components/create-notification-popup/create-notification-popup.component';
import {CreateNotificationPopupModule} from "./components/create-notification-popup/create-notification-popup.module";



const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

const routes: Routes = [
  {component: PlansPageComponent, path: "plans"},
  {path: '', redirectTo: 'plans', pathMatch: 'full'},
  {path: 'plan/:planId', component: PlanPageComponent},
  {path: 'plan/buy/:orderType/:planId', component: BuyPlanPageComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginPageComponent},
  {path: 'thank-you', component: ThankYouPageComponent},
  {path: 'my-orders', component: MyOrdersPageComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/:customerId', component: DashboardPageComponent, canActivate: [AuthGuard]},
  {path: 'admin', component: AdminPageComponent},
  {path: 'shop', component: ShopPageComponent},
  {path: 'product/:productId', component: ProductPageComponent},
  {path: 'notifications', component: NotificationPageComponent},
  {path: 'chat', component: ChatPageComponent, canActivate: [AuthGuard]},
  {path: 'calls', component: CallsPageComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HeaderModule,
    RightBarModule,
    MatSidenavModule,
    MatButtonModule,
    RouterModule.forRoot(routes),
    PlansPageModule,
    HttpClientModule,
    CommonModule,
    PlanPageModule,
    BuyPlanPageModule,
    MatSnackBarModule,
    MatNativeDateModule,
    LoginPageModule,
    ThankYouPageModule,
    MyOrdersPageModule,
    DashboardPageModule,
    AdminPageModule,
    MatTabsModule,
    CreateNewCustomerModule,
    CreateNewOrderModule,
    CreateNewProductModule,
    ShopPageModule,
    ProductPageModule,
    NotificationPageModule,
    ChatPageModule,
    CallsPageModule,
    CreateCallPopupModule,
    CallPopupModule,
    SignalToCallPopupModule,
    SocketIoModule.forRoot(config),
    ImagePopupModule,
    CreateNotificationPopupModule
  ],
  providers: [AuthGuard, HttpClient, LoaderService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
