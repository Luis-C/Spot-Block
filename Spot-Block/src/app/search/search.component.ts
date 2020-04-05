import { Component, OnInit, Output } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NotificationsService } from "../_services/notifications.service";
import { Spot } from "../_models/spot";
import { BlockchainService } from "../_services/blockchain.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  // After a search is performed the component emits the results
  @Output() searchResult: BehaviorSubject<Spot[]> = new BehaviorSubject<Spot[]>(
    undefined
  );

  constructor(
    private fb: FormBuilder,
    private notif: NotificationsService,
    private blockchain: BlockchainService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      table: undefined,
      limit: undefined,
      secondary_key: undefined,
    });
  }

  async search() {
    this.notif.notImplemented();
    // TODO: send query to blockchain & emit the results
    let result: Spot[] = await this.blockchain.query_table(
      this.searchForm.value.table,
      this.searchForm.value.limit,
      this.searchForm.value.secondary_key
    );

    this.notif.displayMessage(`Returned ${result.length} results!`);
    this.searchResult.next(result);
  }
}
