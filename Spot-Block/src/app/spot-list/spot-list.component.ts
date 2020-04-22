import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-spot-list",
  templateUrl: "./spot-list.component.html",
  styleUrls: ["./spot-list.component.scss"]
})
export class SpotListComponent implements OnInit {
  spotsArr;

  constructor() {}

  ngOnInit(): void {}

  resultHandler(result) {
    this.spotsArr = result;
  }
}
