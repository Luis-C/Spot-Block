import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NotificationsService } from "../_services/notifications.service";
import { Spot } from "../_models/spot";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  // for demo only
  demoSpot: Spot = {
    lot: "Some Parking Lot",
    coord: "some coords",
    owner: undefined,
    current_bid: 1000,
    rent_time: 3
  };

  constructor(private fb: FormBuilder, private notif: NotificationsService) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      val1: [""],
      val2: [""],
      val3: [""]
    });
  }

  search() {
    console.log(this.searchForm.value);
    this.notif.notImplemented();
  }
}
