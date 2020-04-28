import { Component, OnInit } from "@angular/core";

/**
 * This has been deprecated and should be deleted
 * @deprecated
 */
@Component({
  selector: "app-purchase",
  templateUrl: "./purchase.component.html",
  styleUrls: ["./purchase.component.scss"],
})
export class PurchaseComponent implements OnInit {
  selected: string;

  constructor() {}

  ngOnInit(): void {}
}
