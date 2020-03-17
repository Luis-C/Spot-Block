import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class NotificationsService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Notify the user that this action is not implemented
   */
  notImplemented() {
    this.snackBar.open("Action not implemented", "ok", {
      duration: 4000
    });
  }

  /**
   * Display a message to the user.
   * @param message the message to be displayed.
   */
  displayMessage(message: string) {
    this.snackBar.open(message, "ok", { duration: 4000 });
  }
}
