/**
 * Represents the parameter necessary to make a query to the blockchain
 */
export interface BlockchainQuery {
  json: boolean;
  code: string;
  scope: string;
  table: string;
  limit: number;
  upper_bound?: string;
  lower_bound?: string;
  table_key?: string;
}
