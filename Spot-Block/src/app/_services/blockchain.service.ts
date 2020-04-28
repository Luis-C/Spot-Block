import { Injectable } from "@angular/core";
import { JsonRpc } from "eosjs";
import { BlockchainQuery } from "../_models/query";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
declare function require(name: string);
const fetch = require("node-fetch");

const rpc = new JsonRpc("http://localhost:8888", { fetch });
// const rpc = new JsonRpc("http://127.0.0.1:8888", { fetch });

/**
 * This service is in charge of directly communicating with the blockchain
 * Query tables is the main function to retrieve any data from the blockchain,
 * however we also have some specialized functions like getFunds
 */
@Injectable({
  providedIn: "root",
})
export class BlockchainService {
  private PATH = "http://localhost:9090/";
  private APIKEY = "5JXHv4edenfu75SB45mDChEnw9yZ5oZMBfbmtJ6mJNjxxnDatgy"; // TODO: remove
  private USERKEY = "";

  // TODO: (optional) create interface for response from API

  constructor(private http: HttpClient, private auth: AuthService) {}

  /**
   * Update key to current value in authService
   */
  updateKey() {
    // set keys:
    this.USERKEY = this.auth.currentKeyValue;
    // console.log(this.USERKEY); // for debugging only
  }

  /**
   * Test call to see if the blockchain is responsive
   */
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

  /**
   * Let user place a bid on an auction
   * @param {any} data
   * @param {string} data.auctionid - unique auction ID in the blockchain
   * @param {string} data.bidamount - amount the user is bidding
   */
  bid({ auctionid, bidamount }): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(`${this.PATH}bid`, {
      key: this.USERKEY,
      user: this.auth.currentUserValue.ID,
      userid: this.auth.currentUserValue.ID,
      auctionid: auctionid,
      bidamount: bidamount,
    });
  }

  /**
   * Let user create an auction
   * @param {any} data - to be sent to the blockchain
   * @param data.spotid - unique id of the spot
   * @param data.time - hour interval (must be a multiple of 2)
   * @param data.day - day for the bid
   * @param data.month - month in which to place the bid (1 = Jan)
   */
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

  /**
   * Retrieve the users current balance
   */
  async getFunds() {
    try {
      let username = this.auth.currentUserValue.ID;
      if (username == undefined) throw new Error("No current user");
      let resp = await this.query_table("users", 1000);
      let arr = resp.filter((user) => user.ID == username);
      return arr[0].funds;
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Retrieve an array of rented spots for the current user
   */
  async getSpotRentals() {
    let arr;
    try {
      let query: BlockchainQuery = {
        json: true,
        code: "spotblock",
        scope: "spotblock",
        table: "users",
        limit: 1000, // must be all users
      };
      let username = this.auth.currentUserValue.ID;
      if (username == undefined) throw new Error("No current user");
      let resp = await rpc.get_table_rows(query);
      arr = resp.rows.filter((user) => user.ID == username);
      return arr[0].spotRentals;
    } catch (e) {
      arr = undefined;
    }
    return arr;
  }

  /**
   * Function used before authentication to verify if the user is in the blockchain
   * @param username - name to be verified
   */
  async isUser(username: string) {
    let resp = await this.query_table("users", 1000);
    let arr = resp.filter((user) => user.ID == username);

    try {
      if (arr[0]) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
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

    try {
      const resp = await rpc.get_table_rows(query);
      x = resp.rows;
    } catch (e) {
      x = null;
    }

    return x;
  }
}
