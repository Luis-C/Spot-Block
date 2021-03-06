import { Component, OnInit, Input, Inject } from "@angular/core";
import { Auction } from "../_models/auction";
import { BlockchainService } from "../_services/blockchain.service";
import { NotificationsService } from "../_services/notifications.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Lots, Spot } from "../_models/spot";
import { AuthService } from "../_services/auth.service";

export interface DialogData {
  amount: string;
}

@Component({
  selector: "app-auction",
  templateUrl: "./auction.component.html",
  styleUrls: ["./auction.component.scss"],
})
export class AuctionComponent implements OnInit {
  @Input() auction: Auction;
  @Input() lot: number;
  private amount: number;
  spots: Spot[];

  constructor(
    private blockchain: BlockchainService,
    private notif: NotificationsService,
    private auth: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load().then((r) => console.log(r));
  }

  async load() {
    this.spots = await this.blockchain.query_table("spots", 1000, undefined);
  }

  owned(id: string): boolean {
    if (this.spots) {
      const spot = this.spots.find((s) => s.ID === id);
      if (spot) {
        return spot.owner === this.auth.currentUserValue.ID;
      }
    }
    return false;
  }

  /**
   * Return true if the user has a bid on this auction
   */
  userIsBidding(): boolean {
    return this.auction.currentBidder === this.auth.currentUserValue.ID;
  }

  /**
   * Send bid to the blockchain
   * @param data
   */
  bid(data: DialogData) {
    this.blockchain
      .bid({
        auctionid: this.auction.ID,
        bidamount: data.amount,
      })
      .subscribe((result) => this.notif.displayMessage(result.response));
  }

  /**
   * Open dialog form to place a bid on this auction
   * @param data
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(bidDialog, {
      width: "250px",
      data: { amount: this.amount },
    });

    // s
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bid(result);
      }
    });
  }

  /**
   * Get lot from a spot and use that to display the appropriate google maps link
   * @param spot
   */
  getLotUrl(spot: string) {
    let found;
    if (this.spots) {
      found = this.spots.find((s) => s.ID === spot);
    }
    let lot;
    if (found) {
      lot = found.lot;
    }
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

  toLot(spot: string) {
    let found;
    if (this.spots) {
      found = this.spots.find((s) => s.ID === spot);
    }
    let lot;
    if (found) {
      lot = found.lot;
    }
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

  displayTime(t: number): string {
    if (t === 0) {
      return "12:00 AM";
    } else if (t < 12) {
      return t + ":00 AM";
    } else if (t === 12) {
      return t + ":00 PM";
    } else {
      return t - 12 + ":00 PM";
    }
  }
}

/**
 * Dialog to place a bid
 */
@Component({
  selector: "bid-dialog",
  templateUrl: "bid-dialog.html",
})
export class bidDialog {
  constructor(
    public dialogRef: MatDialogRef<bidDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
