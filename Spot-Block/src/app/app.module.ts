import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material-module/material-module.module";
import { LoginComponent } from "./login/login.component";
import { HomeComponent, auctionDialog } from "./home/home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SpotComponent } from "./spot/spot.component";
import { SearchComponent } from "./search/search.component";
import { SpotListComponent } from "./spot-list/spot-list.component";
import { HttpClientModule } from "@angular/common/http";
import { AuctionListComponent } from "./auction-list/auction-list.component";
import { AuctionComponent, bidDialog } from "./auction/auction.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SpotComponent,
    SearchComponent,
    SpotListComponent,
    AuctionListComponent,
    AuctionComponent,
    auctionDialog,
    bidDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  entryComponents: [auctionDialog, bidDialog],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
