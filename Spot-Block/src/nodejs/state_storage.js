/* This file contains data structures for storing block chain state */


/* class to hold information on the owners and bidders for spots */
class Person {
  /*creates a person object
    parameter is a unique id*/
    constructor(id) {
    //a unique identifier for the person
    this.id = id;
    //how many tokens they have, initialize to 0
    this.funds = 0;
    //spot that they own, initially don't own any
    this.spot = null; //possibility for multiple spots??
  }

  /* prints the id of the person to console */
  getId() {
    return this.id;
  }

  /* returns the current funds of a person */
  getFunds() {
    return this.funds;
  }

  /* adds amount to funds */
  addFunds(amount) {
    this.funds += amount;
  }

  /* removes amount from funds */
  removeFunds(amount) {
    this.funds -= amount;
  }

  /* returns true is person owns a spot */
  hasSpot() {
    return !(this.spot === null);
  }

  /* returns spot object */
  getSpot() {
    return this.spot;
  }

  /* sets a spot */
  addSpot(spot) {
    this.spot = spot;
  }
}


/* class to hold information on spots in the parking lot */
class Spot {
  constructor(lot, coord) {
    //this is the parking lot the spot is located in
    this.lot = lot;
    //google map coordinate in the lot
    this.coord = coord;
    //current owner of the lot, initially no one owns
    this.owner = null;
    //current bid for this spot, initially -1, not for sale
    this.current_bid = 0;
    //this is the current time frame it is rented for, e.g. until 12pm
    this.rent_time = -1; //not sure how to keep track yet, -1 for now??
  }

  /* return true if spot has an owner */
  isOwned() {
    return !(this.owner === null)
  }

  /* return the lot */
  getLot() {
    return this.lot;
  }

  /* return location */
  getCoord() {
    return this.coord;
  }

  /* returns the current bidding price */
  getPrice() {
    return this.current_bid;
  }

  /* return the current owner */
  getOwner() {
    return this.owner;
  }

  /* return true if spot is currently for sale */
  is_in_auction() {
    return this.current_bid > 0;
  }

  /* add a new bid for the spot */
  add_bid(amount) {
    //can only increase a bid
    if (amount > this.current_bid) {
      this.current_bid = amount;
      return true;
    }
    return false;
  }

  /* someone wins spot, pass to new owner for time */
  purchase(owner, time) {
    this.owner = owner;
    this.rent_time = time;
    this.current_bid = -1;
  }

  /* put spot up for auction at the starting bid */
  auction(start_bid) {
    //can't start bidding if it is already in auction
    if (this.current_bid > -1)
      return false;
    this.current_bid = start_bid;
    return true;
  }

}

/** Data structure to hold block chain state for spots **/
class Chain_Summary {
  /* default constructor */
  constructor() {
    //create map of lots
    this.lots = new Map();
    //array of spots in auction, sorted by price
    this.auction = new Array();
    //array of every spot
    this.all = new Array();
    //hold current users
    this.users = new Array();
  }

  /******** Functions For Writes *******/
  /* puts a spot in the auction list */
  move_to_auction(spot) {
    //check length
    if (this.auction.length === 0)
      this.auction.push(spot);
    //expect that newest is highest so check first
    else if (this.auction[this.auction.length - 1].getPrice() < spot.getPrice())
      this.auction.push(spot);
    else {
      for (var i = 0; i < this.auction.length; i++) {
        if (this.auction[i].getPrice() > spot.getPrice()) {
          this.auction.splice(i, 0, spot);
          break;
        }
      }
    }
  }

  /* removes a spot from auction */
  remove_from_auction(spot) {
    if (spot.is_in_auction()) {
      for (var i = 0; i < this.auction.length; i++) {
        if (this.auction[i].getCoord() === spot.getCoord()) {
          this.auction.splice(i, 1);
          break;
        }
      }
    }
  }

  /* remove a user */
  remove_user(user) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].getId() === user.getId())
        this.users.splice(i, 1);
    }
  }

  /****** Functions For Initialization ********/
  /* adds a user to the array */
  add_user(user) {
    this.users.push(user);
  }

  /* add a parking lot*/
  add_lot(lot_name) {
    //create spot mapping by location
    let lot = new Map();

    //add lot to the map of lots
    this.lots.set(lot_name, lot);
  }

  /* adds a spot object to a parking lot */
  add_spot(spot) {
    //check to make sure spot obj
    if (!(spot instanceof Spot))
      return false;

    //place the spot in the correct location
    this.lots.get(spot.getLot()).set(spot.getCoord(), spot);

    //add spot in order of increasing price
    if (spot.is_in_auction()) {
      //check length
      if (this.auction.length === 0)
        this.auction.push(spot);
      //expect that newest is highest so check first
      else if (this.auction[this.auction.length - 1].getPrice() < spot.getPrice())
        this.auction.push(spot);
      else {
        for (var i = 0; i < this.auction.length; i++) {
          if (this.auction[i].getPrice() > spot.getPrice()) {
            this.auction.splice(i, 0, spot);
            break;
          }
        }
      }
    }

    //add spot to overall
    this.all.push(spot);

    //spot added
    return true;
  }

  /******** Functions For Reads **************************/
  /* get a spot by location */
  get_spot_by_location(lot, coord) {
    return (this.lots.get(lot)).get(coord);
  }

  /* get all spots from a parking lot as 2d array */
  get_spots_by_lot(lot) {
    return this.lots.get(lot);
  }

  /* Returns an array of spots with a price more than
     the price provided */
  get_spots_more_than(price) {
    for (var i = 0; i < this.auction.length; i++) {
      if (this.auction[i].getPrice() > price)
        return this.auction.slice(i, this.auction.length);
    }
    return null;
  }

  /* get spots less than the price */
  get_spots_less_than(price) {
    for (var i = 0; i < this.auction.length; i++) {
      if (this.auction[i].getPrice() >= price)
        return this.auction.slice(0, i);
    }
    return null;
  }

  /* get spots between the range inclusively */
  get_spots_in_range(price_min, price_max) {
    //console.log(this.auction[1].getPrice());
    var j = -1;
    var k = -1;
    var i;
    for (i = 0; i < this.auction.length; i++) {
      if (j == -1 && this.auction[i].getPrice() >= price_min)
        j = i;
      if (k == -1 && this.auction[i].getPrice() >= price_max) {
        k = i;
        break;
      }
    }
    //max is rest
    if (k == -1)
      k = i;
    //everything below the minimum
    if (j == -1)
      return null;

    //return range
    return this.auction.slice(j, k+1);
  }

  /* get all the spots in auction currently */
  get_forsale_spots() {
    return this.auction;
  }

  /* get all spots */
  get_all_spots() {
    return this.all;
  }
}


/******** Tests ************/
const assert = require('assert');

/* basic test */
function test1() {
  let data = new Chain_Summary();
  data.add_lot("test");
  let test_spot = new Spot("test", "loc");
  data.add_spot(test_spot);
  assert(data.get_spot_by_location("test", "loc").getCoord() === "loc");
}

/* test range */
function test2() {
  let data = new Chain_Summary();
  data.add_lot("test");
  let test_spot = new Spot("test", "loc");
  test_spot.add_bid(5);
  let test_spot2 = new Spot("test", "loc2");
  test_spot2.add_bid(6);
  let test_spot3 = new Spot("test", "loc3");
  test_spot3.add_bid(7);
  let test_spot4 = new Spot("test", "loc4");
  test_spot4.add_bid(8);

  data.add_spot(test_spot);
  data.add_spot(test_spot2);
  data.add_spot(test_spot3);
  data.add_spot(test_spot4);

  const arr = data.get_spots_in_range(6, 7);
  assert(arr.length == 2);
  assert(arr[0].getCoord() === "loc2");
  assert(arr[1].getCoord() === "loc3");
}

/* test less than */
function test3() {
  let data = new Chain_Summary();
  data.add_lot("test");
  let test_spot = new Spot("test", "loc");
  test_spot.add_bid(5);
  let test_spot2 = new Spot("test", "loc2");
  test_spot2.add_bid(6);
  let test_spot3 = new Spot("test", "loc3");
  test_spot3.add_bid(7);
  let test_spot4 = new Spot("test", "loc4");
  test_spot4.add_bid(8);

  data.add_spot(test_spot);
  data.add_spot(test_spot2);
  data.add_spot(test_spot3);
  data.add_spot(test_spot4);

  const arr = data.get_spots_less_than(7);
  assert(arr.length == 2);
  assert(arr[0].getCoord() === "loc");
  assert(arr[1].getCoord() === "loc2");
}

/* test more than */
function test4() {
  let data = new Chain_Summary();
  data.add_lot("test");
  let test_spot = new Spot("test", "loc");
  test_spot.add_bid(5);
  let test_spot2 = new Spot("test", "loc2");
  test_spot2.add_bid(6);
  let test_spot3 = new Spot("test", "loc3");
  test_spot3.add_bid(7);
  let test_spot4 = new Spot("test", "loc4");
  test_spot4.add_bid(8);

  data.add_spot(test_spot);
  data.add_spot(test_spot2);
  data.add_spot(test_spot3);
  data.add_spot(test_spot4);

  const arr = data.get_spots_more_than(6);
  assert(arr.length == 2);
  assert(arr[0].getCoord() === "loc3");
  assert(arr[1].getCoord() === "loc4");
}

/* test writes */
function test5() {
  let data = new Chain_Summary();
  data.add_lot("test");

  let test_spot = new Spot("test", "loc");
  test_spot.add_bid(5);
  data.add_spot(test_spot);
  data.remove_from_auction(test_spot);
  const arr = data.get_forsale_spots();
  assert(arr.length == 0);
  data.move_to_auction(test_spot);
  const arr2 = data.get_forsale_spots();
  assert(arr2.length == 1);
  assert(arr2[0].getCoord() === "loc");
}

test1();
test2();
test3();
test4();
test5();
