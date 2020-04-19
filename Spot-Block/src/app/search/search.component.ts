import { Component, OnInit, Output, Input } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NotificationsService } from "../_services/notifications.service";
import { Spot } from "../_models/spot";
import { BlockchainService } from "../_services/blockchain.service";
import { BehaviorSubject } from "rxjs";
import { Person } from "../_models/person";
import { Auction } from "../_models/auction";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  // TODO: take table as input
  @Input() table: string;
  searchForm: FormGroup;
  // After a search is performed the component emits the results
  @Output() searchResult:
    | BehaviorSubject<Spot[]>
    | BehaviorSubject<Person[]>
    | BehaviorSubject<Auction[]> = new BehaviorSubject<any[]>(undefined);

  constructor(
    private fb: FormBuilder,
    private notif: NotificationsService,
    private blockchain: BlockchainService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      table: [{ value: this.table, disabled: true }],
      limit: undefined,
      secondary_key: undefined,
    });
  }

  async search() {
    this.notif.notImplemented();
    // TODO: send query to blockchain & emit the results
    let result: any[] = await this.blockchain.query_table(
      this.searchForm.value.table,
      this.searchForm.value.limit,
      this.searchForm.value.secondary_key
    );

    this.notif.displayMessage(`Returned ${result.length} results!`);
    this.searchResult.next(result);
  }
}
