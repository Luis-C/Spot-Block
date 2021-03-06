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

  /**
   * Convert a lot enum to a string
   * @param lot from Lots enum
   */
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

  /**
   * Used to link the Map button to the appropriate location
   * @param lot from Lots enum
   */
  getLotUrl(lot: Lots) {
    switch (lot) {
      case Lots.PERRY_ST: {
        return "https://goo.gl/maps/zxtJ7QT4aVv8x3wc6";
      }
      case Lots.GOODWIN: {
        return "https://goo.gl/maps/MC4qrcHVL92LhL2n6";
      }
      case Lots.DUCK_POND: {
        return "https://goo.gl/maps/XKRaKz78mNraBkZe9";
      }
      case Lots.LANE_STADIUM: {
        return "https://goo.gl/maps/LwNbTBfn8BtBexz66";
      }
      default: {
        // Virginia tech on Google Maps
        return "https://goo.gl/maps/K3PR5Wf6rpcnvhweA";
      }
    }
  }
}
