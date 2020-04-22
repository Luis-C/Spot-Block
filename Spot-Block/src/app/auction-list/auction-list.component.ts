import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-auction-list",
  templateUrl: "./auction-list.component.html",
  styleUrls: ["./auction-list.component.scss"],
})
export class AuctionListComponent implements OnInit {
  auctionsArr;

  constructor() {}

  ngOnInit(): void {}

  resultHandler(result) {
    this.auctionsArr = result;
  }
}
