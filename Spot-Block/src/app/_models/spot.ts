import { Person } from "./person";

export interface Spot {
  lot: string;
  coord: string;
  owner: Person | null;
  current_bid: number;
  rent_time: number;
}
