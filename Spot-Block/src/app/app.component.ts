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

  constructor(
    private router: Router,
    private notif: NotificationsService,
    private auth: AuthService
  ) {
    this.auth.currentUser.subscribe((x) => (this.currentUser = x));
  }

  get isUser() {
    return this.currentUser;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
    // this.notif.notImplemented();
  }
}
