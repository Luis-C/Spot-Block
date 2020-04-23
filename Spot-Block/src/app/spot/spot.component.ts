import { Component, OnInit, Input, Inject } from "@angular/core";
import { Spot, Lots } from "../_models/spot";
import { BlockchainService } from "../_services/blockchain.service";
import { AuthService } from "../_services/auth.service";
import { NotificationsService } from "../_services/notifications.service";


/**
 * Reusable component to display a Spot
 *
 * Usage:
 * <app-spot [spot]="someSpot"></app-spot>
 */
@Component({
  selector: "app-spot",
  templateUrl: "./spot.component.html",
  styleUrls: ["./spot.component.scss"],
})
export class SpotComponent implements OnInit {
  @Input() spot: Spot;

  constructor(
    private blockchain: BlockchainService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  isOwnedByUser(): boolean {
    return this.auth.currentUserValue.ID === this.spot.owner;
  }

  // buy() {
  //   this.blockchain
  //     .assignSpot({
  //       accountid: this.auth.currentUserValue.ID,
  //       spotid: this.spot.ID,
  //     })
  //     .subscribe((result) => this.notif.displayMessage(result.response));
  // }

  toLot(lot: Lots) {
    switch (lot) {
      case Lots.PERRY_ST: {
        return "Perry St.";
      }
      case Lots.GOODWIN: {
        return "Goodwin";
      }
      case Lots.DUCK_POND: {
        return "Duck Pond";
      }
      case Lots.LANE_STADIUM: {
        return "Lane Stadium";
      }
      default: {
        return "Not a recognized lot";
      }
    }
  }
}
