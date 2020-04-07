import { Component, OnInit } from "@angular/core";
import { BlockchainService } from "../_services/blockchain.service";
import { Spot } from "../_models/spot";
import { AuthService } from "../_services/auth.service";
import { Auction } from "../_models/auction";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  spots: Spot[];
  auctions: Auction[];
  currentUser: string;

  constructor(
    private auth: AuthService,
    private blockchain: BlockchainService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue.ID;
    this.load().then((r) => console.log(r));
  }

  async load() {
    this.spots = await this.blockchain.query_table("spots", 0, undefined);

    this.auctions = await this.blockchain.query_table("auctions", 0, undefined);
  }
}
