import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NotificationsService } from "../_services/notifications.service";
import { Spot } from "../_models/spot";
import { BlockchainService } from "../_services/blockchain.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  // @Output() searchResult: Spot[];
  // for demo only
  demoSpot: Spot = {
    lot: "Some Parking Lot",
    coord: "some coords",
    owner: undefined,
    current_bid: 1000,
    rent_time: 3
  };

  constructor(
    private fb: FormBuilder,
    private notif: NotificationsService,
    private blockchain: BlockchainService
  ) {}

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
    // TODO: send query to blockchain
    // this.blockchain.query(this.searchForm.value);
  }
}
