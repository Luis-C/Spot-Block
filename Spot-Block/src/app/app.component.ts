import { Component } from "@angular/core";
import { NotificationsService } from "./_services/notifications.service";
import { AuthService } from "./_services/auth.service";
import { Person } from "./_models/person";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Spot-Block";
  currentUser: Person;
  homeDisabled: boolean;
  auctionsDisabled: boolean;
  searchDisabled: boolean;

  constructor(
    private router: Router,
    private notif: NotificationsService,
    private auth: AuthService
  ) {
    this.auth.currentUser.subscribe((x) => (this.currentUser = x));
    this.homeDisabled = true;
  }

  get isUser() {
    return this.currentUser;
  }

  home() {
    this.homeDisabled = true;
    this.auctionsDisabled = false;
    this.searchDisabled = false;
  }

  auctions() {
    this.homeDisabled = false;
    this.auctionsDisabled = true;
    this.searchDisabled = false;
  }

  search() {
    this.homeDisabled = false;
    this.auctionsDisabled = false;
    this.searchDisabled = true;
  }


  logout() {
    this.homeDisabled = true;
    this.auctionsDisabled = false;
    this.searchDisabled = false;
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
}
