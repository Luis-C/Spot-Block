import { Component, OnInit, Input, Inject } from "@angular/core";
import { Spot, Lots } from "../_models/spot";
import { BlockchainService } from "../_services/blockchain.service";
import { AuthService } from "../_services/auth.service";
import { NotificationsService } from "../_services/notifications.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

export interface DialogData {
  time: string;
  day: string;
  month: string;
}

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

  time: string;
  day: string;
  month: string;

  constructor(
    private blockchain: BlockchainService,
    private auth: AuthService,
    private notif: NotificationsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  isOwnedByUser(): boolean {
    return this.auth.currentUserValue.ID === this.spot.owner;
  }

  buy() {
    this.blockchain
      .assignSpot({
        accountid: this.auth.currentUserValue.ID,
        spotid: this.spot.ID,
      })
      .subscribe((result) => this.notif.displayMessage(result.response));
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

  private auction({ time, day, month }) {
    this.blockchain
      .createAuc({
        spotid: this.spot.ID,
        time: time,
        day: day,
        month: month,
      })
      .subscribe((result) => this.notif.displayMessage(result.response));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(auctionDialog, {
      width: "250px",
      data: { time: this.time, day: this.day, month: this.month },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
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
  constructor(
    public dialogRef: MatDialogRef<auctionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
