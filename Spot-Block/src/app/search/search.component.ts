import { Component, OnInit, Output } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NotificationsService } from "../_services/notifications.service";
import { Spot } from "../_models/spot";
import { BlockchainService } from "../_services/blockchain.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  // After a search is performed the component emits the results
  @Output() searchResult: BehaviorSubject<Spot[]> = new BehaviorSubject<Spot[]>(
    undefined
  );

  constructor(
    private fb: FormBuilder,
    private notif: NotificationsService,
    private blockchain: BlockchainService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      table: [""],
      limit: [""],
      secondary_key: [""]
    });
  }

  async search() {
    console.log(this.searchForm.value);
    this.notif.notImplemented();
    // TODO: send query to blockchain & emit the results
    let result: Spot[] = await this.blockchain.query_table(
      this.searchForm.value
    );
    this.searchResult.next(result);

    // for demo only
    // let demoSpotArr: Spot[] = [
    //   {
    //     lot: "Some Parking Lot",
    //     coord: "some coords",
    //     owner: undefined,
    //     current_bid: 1000,
    //     rent_time: 3
    //   },
    //   {
    //     lot: "Another Parking Lot",
    //     coord: "some coords",
    //     owner: undefined,
    //     current_bid: 500,
    //     rent_time: 2
    //   },
    //   {
    //     lot: "Parking Lot",
    //     coord: "some coords",
    //     owner: undefined,
    //     current_bid: 700,
    //     rent_time: 2
    //   },
    //   {
    //     lot: "Parking Lot",
    //     coord: "some coords",
    //     owner: undefined,
    //     current_bid: 700,
    //     rent_time: 2
    //   },
    //   {
    //     lot: "Parking Lot",
    //     coord: "some coords",
    //     owner: undefined,
    //     current_bid: 700,
    //     rent_time: 2
    //   },
    //   {
    //     lot: "Parking Lot",
    //     coord: "some coords",
    //     owner: undefined,
    //     current_bid: 700,
    //     rent_time: 2
    //   },
    //   {
    //     lot: "Parking Lot",
    //     coord: "some coords",
    //     owner: undefined,
    //     current_bid: 700,
    //     rent_time: 2
    //   }
    // ];
    // this.searchResult.next(demoSpotArr);
  }
}
