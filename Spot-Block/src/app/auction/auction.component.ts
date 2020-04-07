import { Component, OnInit, Input } from "@angular/core";
import { Auction } from "../_models/auction";
import { BlockchainService } from "../_services/blockchain.service";
import { AuthService } from "../_services/auth.service";
import { NotificationsService } from "../_services/notifications.service";

@Component({
  selector: "app-auction",
  templateUrl: "./auction.component.html",
  styleUrls: ["./auction.component.scss"],
})
export class AuctionComponent implements OnInit {
  @Input() auction: Auction;

  constructor(
    private blockchain: BlockchainService,
    private auth: AuthService,
    private notif: NotificationsService
  ) {}

  ngOnInit(): void {}

  // isOwnedByUser() {
  //   return this.auth.currentUserValue.ID === this.auction;
  // }

  bid() {
    this.blockchain
      .bid({
        auctionid: this.auction.ID,
        userid: this.auth.currentUserValue.ID,
        bidamount: 5,
      })
      .subscribe((result) => this.notif.displayMessage(result.response));
  }
}
