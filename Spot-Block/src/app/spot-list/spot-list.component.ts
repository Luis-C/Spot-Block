import { Component, OnInit } from "@angular/core";
import {NotificationsService} from "../_services/notifications.service";

@Component({
  selector: "app-spot-list",
  templateUrl: "./spot-list.component.html",
  styleUrls: ["./spot-list.component.scss"]
})
export class SpotListComponent implements OnInit {
  spotsArr;
  lot: number;

  constructor(private notif: NotificationsService) {}

  ngOnInit(): void {}

  lotHandler(selected) {
    this.lot = selected;
  }

  resultHandler(result) {
    if (result) {
      this.spotsArr = result.filter(s => s.lot == this.lot);
      this.notif.displayMessage(`Returned ${this.spotsArr.length} results!`);
    }
  }
}
