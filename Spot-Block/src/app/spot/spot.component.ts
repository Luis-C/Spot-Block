import { Component, OnInit, Input } from "@angular/core";
import { Spot } from "../_models/spot";

/**
 * Reusable component to display a Spot
 */
@Component({
  selector: "app-spot",
  templateUrl: "./spot.component.html",
  styleUrls: ["./spot.component.scss"]
})
export class SpotComponent implements OnInit {
  @Input() spot: Spot;

  constructor() {}

  ngOnInit(): void {}
}
