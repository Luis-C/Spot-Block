export enum Lots {
  PERRY_ST,
  GOODWIN,
  DUCK_POND,
  LANE_STADIUM,
}

export interface Spot {
  ID: string; // One letter for lot, two chars for spot identifier
  owner: string | null;
  lot: Lots;
  rentees: any[];
}
