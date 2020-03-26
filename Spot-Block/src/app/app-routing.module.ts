import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { SearchComponent } from "./search/search.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "search", component: SearchComponent },
  { path: "**", redirectTo: "login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
