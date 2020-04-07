export interface Auction {
  ID: string; // Form of "{spot}.{month}.{day}.{time}"
  spot: string; // eosio::name
  uTime: number; // u = use
  uDay: number;
  fTime: number; // f = final
  fDay: number;
  fMonth: number;
  highestBid: number;
  currentBidder: string; // must match user_struct::ID
}
