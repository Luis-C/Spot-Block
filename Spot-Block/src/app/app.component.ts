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
  purchaseDisabled: boolean;
  bidDisabled: boolean;
  sellDisabled: boolean;

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
    this.purchaseDisabled = false;
    this.bidDisabled = false;
    this.sellDisabled = false;
  }

  purchase() {
    this.homeDisabled = false;
    this.purchaseDisabled = true;
    this.bidDisabled = false;
    this.sellDisabled = false;
  }

  bid() {
    this.homeDisabled = false;
    this.purchaseDisabled = false;
    this.bidDisabled = true;
    this.sellDisabled = false;
  }

  // sell() {
  //   this.homeDisabled = false;
  //   this.purchaseDisabled = false;
  //   this.bidDisabled = false;
  //   this.sellDisabled = true;
  // }

  logout() {
    this.homeDisabled = true;
    this.purchaseDisabled = false;
    this.bidDisabled = false;
    this.sellDisabled = false;
    this.auth.logout();
    this.router.navigate(["/login"]);
    // this.notif.notImplemented();
  }
}
