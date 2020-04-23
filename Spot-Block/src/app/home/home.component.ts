import {Component, Inject, OnInit} from "@angular/core";
import { BlockchainService } from "../_services/blockchain.service";
import {Lots, Spot} from "../_models/spot";
import { AuthService } from "../_services/auth.service";
import { Auction } from "../_models/auction";
import {NotificationsService} from "../_services/notifications.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

export interface DialogData {
  time: string;
  date: Date;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  spots: Spot[];
  auctions: Auction[];
  currentUser: string;
  funds: number;
  time: string;
  date: Date;
  aucSpotID: string;

  constructor(
    private auth: AuthService,
    private blockchain: BlockchainService,
    private notif: NotificationsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue.ID;
    this.load().then((r) => console.log(r));
  }

  async load() {
    this.spots = await this.blockchain.query_table("spots", 1000, undefined);
    this.auctions = await this.blockchain.query_table("auctions", 1000, undefined);
    this.funds = await this.blockchain.getFunds();
  }

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

  aucLot(spot: string) {
    const found = this.spots.find(s => s.ID === spot);
    if (found) {
      return this.toLot(found.lot);
    }
  }

  private auction({ time, date }) {
    this.blockchain
      .createAuc({
        spotid: this.aucSpotID,
        time: time,
        day: date.getDate(),
        month: (date.getMonth() + 1)
      })
      .subscribe((result) => this.notif.displayMessage(result.response));
  }

  openDialog(id: string): void {
    const dialogRef = this.dialog.open(auctionDialog, {
      width: "250px",
      data: { time: this.time, date: this.date },
    });

    this.aucSpotID = id;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.auction(result);
      }
    });
  }
}

/**
 * Dialog Component to set a spot for Auction
 */
@Component({
  selector: "auction-dialog",
  templateUrl: "auction-dialog.html",
})
export class auctionDialog {
  today: Date = new Date();

  constructor(
    public dialogRef: MatDialogRef<auctionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

