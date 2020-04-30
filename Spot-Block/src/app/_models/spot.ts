/**
 * Enum for lots at virginia tech
 * Serves to facilitate conversion between the blockchain and the front-end
 */
export enum Lots {
  PERRY_ST,
  GOODWIN,
  DUCK_POND,
  LANE_STADIUM,
}

/**
 * Represents a parking spot as represented in the blockchain
 */
export interface Spot {
  ID: string; // One letter for lot, two chars for spot identifier
  owner: string | null;
  lot: Lots;
  rentees: any[];
}
