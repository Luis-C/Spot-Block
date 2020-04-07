import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { SpotListComponent } from "./spot-list/spot-list.component";
import {SellComponent} from "./sell/sell.component";
import {PurchaseComponent} from "./purchase/purchase.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "purchase", component: PurchaseComponent },
  { path: "search", component: SpotListComponent },
  { path: "sell", component: SellComponent },
  { path: "**", redirectTo: "login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
