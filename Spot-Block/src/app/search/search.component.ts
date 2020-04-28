import { Component, OnInit, Output, Input } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NotificationsService } from "../_services/notifications.service";
import { Spot } from "../_models/spot";
import { BlockchainService } from "../_services/blockchain.service";
import { BehaviorSubject } from "rxjs";
import { Person } from "../_models/person";
import { Auction } from "../_models/auction";
import { Router } from "@angular/router";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  @Input() table: string;
  searchForm: FormGroup;
  selected: number;
  page: string;
  time: number;
  date: Date;
  today: Date = new Date();
  // After a search is performed the component emits the results
  @Output() searchResult:
    | BehaviorSubject<Spot[]>
    | BehaviorSubject<Person[]>
    | BehaviorSubject<Auction[]> = new BehaviorSubject<any[]>(undefined);
  @Output() searchLot: BehaviorSubject<number> = new BehaviorSubject<number>(
    undefined
  );
  @Output() searchTime: BehaviorSubject<number> = new BehaviorSubject<number>(
    undefined
  );
  @Output() searchDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(
    undefined
  );

  constructor(
    private fb: FormBuilder,
    private notif: NotificationsService,
    private blockchain: BlockchainService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      // table: [{ value: this.table, disabled: true }],
      // limit: undefined,
      time: undefined,
      date: undefined,
      lot: undefined,
      secondary_key: undefined,
    });

    this.page = this.router.url;
  }

  async search() {
    // Send query to blockchain & emit the results
    const result: any[] = await this.blockchain.query_table(
      this.table,
      1000,
      this.searchForm.value.secondary_key
    );

    if (result == null) {
      this.notif.displayMessage(`No results returned.`);
    }
    // TODO: (optional) it would be cleaner to condense these to a single observable
    this.searchLot.next(this.selected);
    this.searchTime.next(this.time);
    this.searchDate.next(this.date);
    this.searchResult.next(result);
  }
}
