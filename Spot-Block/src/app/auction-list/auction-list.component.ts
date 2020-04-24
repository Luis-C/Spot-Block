import { Component, OnInit } from "@angular/core";
import {NotificationsService} from "../_services/notifications.service";
import {BlockchainService} from "../_services/blockchain.service";
import {Spot} from "../_models/spot";

@Component({
  selector: "app-auction-list",
  templateUrl: "./auction-list.component.html",
  styleUrls: ["./auction-list.component.scss"],
})
export class AuctionListComponent implements OnInit {
  auctionsArr;
  lot: number;
  time: string;
  date: Date;
  spots: Spot[];

  constructor(private notif: NotificationsService, private blockchain: BlockchainService) {}

  ngOnInit(): void {
    this.load().then((r) => console.log(r));
  }

  async load() {
    this.spots = await this.blockchain.query_table('spots', 1000, undefined);
  }

  lotHandler(selected) {
    this.lot = selected;
  }

  timeHandler(time) {
    this.time = time;
  }

  dateHandler(date) {
    this.date = date;
  }

  resultHandler(result) {
    if (result) {
      this.auctionsArr = result.filter(a =>
        this.spots.find(s => s.ID === a.spot).lot == this.lot
        && a.uTime == this.time
        && a.uDay === this.date.getDate()
        && a.uMonth === (this.date.getMonth() + 1));
      this.notif.displayMessage(`Returned ${this.auctionsArr.length} results!`);
    }
  }
}
