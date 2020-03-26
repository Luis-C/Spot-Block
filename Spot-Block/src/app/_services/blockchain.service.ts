import { Injectable } from '@angular/core';
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

declare function require(name:string);
const fetch = require('node-fetch');

const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  constructor() { }

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
  async query_table(table: string, upperbound: string, lowerbound: string,
    limit: number, secondary_key) {

    var query = {
      json: true,
      code: 'spotblock',
      scope: 'spotblock',
    };
    query.table = table;

    if (limit != 0)
      query.limit = limit;
    if (!(upperbound === null)
      query.upper_bound = upperbound;
    if (!(lowerbound === null))
      query.lower_bound = lowerbound;
    if (!(secondary_key === null))
      query.table_key = secondary_key;

    var x;
    try {
      const resp = await rpc.get_table_rows(query);
      console.log(resp.rows);
      x = resp.rows;
    } catch(e) {
      x = null;
    }

    return x;
  }
}
