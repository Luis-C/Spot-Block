import { Person } from "./person";

export enum Lots {
  LotA,
  LotB,
}

export interface Spot {
  id: string; // One letter for lot, two chars for spot identifier
  owner: string | null;
  lot: Lots;
  rentees: any;
}
