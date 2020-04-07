import { Component, OnInit, Input, Inject } from "@angular/core";
import { Auction } from "../_models/auction";
import { BlockchainService } from "../_services/blockchain.service";
import { AuthService } from "../_services/auth.service";
import { NotificationsService } from "../_services/notifications.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { auctionDialog } from "../spot/spot.component";

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
  private amount: number;

  constructor(
    private blockchain: BlockchainService,
    private auth: AuthService,
    private notif: NotificationsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  bid(data: DialogData) {
    this.blockchain
      .bid({
        auctionid: this.auction.ID,
        userid: this.auth.currentUserValue.ID,
        bidamount: data.amount,
      })
      .subscribe((result) => this.notif.displayMessage(result.response));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(bidDialog, {
      width: "250px",
      data: { amount: this.amount },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (result) {
        this.bid(result);
      }
    });
  }
}

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
