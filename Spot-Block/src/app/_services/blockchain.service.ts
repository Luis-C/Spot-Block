import { Injectable } from "@angular/core";
import { Api, JsonRpc, RpcError } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import { BlockchainQuery } from "../_models/query";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
declare function require(name: string);
const fetch = require("node-fetch");

const rpc = new JsonRpc("http://localhost:8888", { fetch });
// const rpc = new JsonRpc("http://127.0.0.1:8888", { fetch });

@Injectable({
  providedIn: "root",
})
export class BlockchainService {
  private PATH = "http://localhost:9090/";
  private APIKEY = "5JXHv4edenfu75SB45mDChEnw9yZ5oZMBfbmtJ6mJNjxxnDatgy"; // remove
  private USERKEY = "";

  // TODO: create interface for response from API

  constructor(private http: HttpClient, private auth: AuthService) {}

  /**
   * Update key to current value in authService
   */
  updateKey() {
    // set keys:
    this.USERKEY = this.auth.currentKeyValue;
    // console.log(this.USERKEY); // for debugging only
  }

  test() {
    return this.http.get(`${this.PATH}test`);
  }

  /**
   * This function will be removed
   * @deprecated
   */
  assignSpot({ accountid, spotid }): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(`${this.PATH}assignSpot`, {
      key: this.APIKEY,
      user: "spotblock",
      accountid: accountid,
      spotid: spotid,
    });
  }

  bid({ auctionid, bidamount }): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(`${this.PATH}bid`, {
      key: this.USERKEY,
      user: this.auth.currentUserValue.ID,
      userid: this.auth.currentUserValue.ID,
      auctionid: auctionid,
      bidamount: bidamount,
    });
  }

  createAuc({ spotid, time, day, month }): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(`${this.PATH}createAuc`, {
      key: this.USERKEY,
      user: this.auth.currentUserValue.ID,
      spotid: spotid,
      time: time,
      day: day,
      month: month,
    });
  }

  /*
   * Function to read from a table in the block chain.
   * @param table is the name of the table you want to access. A valid name must
   * be provided
   * @param upperbound can be null, is upper limit on key value
   * @param lowerbound can be null, is lower limit on key value
   * @param limit can be 0 if no limit, is the first n elements from query
   * @param secondary_key can be null if querying by primary key, this is a key
   * to use instead of searching by the primary key
   * @return an array of json objects, an empty array if nothing and null if
   * the query failed for some reason
   */
  async query_table(
    table: string,
    limit?: number,
    secondary_key?: string,
    upperbound?: string,
    lowerbound?: string
  ) {
    let query: BlockchainQuery = {
      json: true,
      code: "spotblock",
      scope: "spotblock",
      table: table,
      limit: limit ?? 0,
    };

    if (upperbound) query.upper_bound = upperbound;
    if (lowerbound) query.lower_bound = lowerbound;
    if (secondary_key) query.table_key = secondary_key;

    let x;

    console.log(query);

    try {
      const resp = await rpc.get_table_rows(query);
      console.log(resp.rows);
      x = resp.rows;
    } catch (e) {
      x = null;
    }

    return x;
  }
}
