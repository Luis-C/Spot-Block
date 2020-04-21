#include <eosio/eosio.hpp>
#include <map>
//#include "spot.cpp"

using namespace eosio;
//TODO: Switch the if else to eosio.assert
class [[eosio::contract("parkingdb")]] parkingdb : public eosio::contract {
    public:
        using contract::contract;
//FUCTIONALITY ACTIONS

        /*
        * This should remove rentees when their two hour slot has expired
        * Pass in the current time minus 2
        */
        [[eosio::action]]
        void expire(std::string time) {
          //require authority of spotblock to run
          require_auth(_self);

          //loop through the spots
          auto spot = spots_table.begin();
          while (spot != spots_table.end()) {
            //remove rentees with this time
            spots_table.modify(spot, _self, [&](auto& row) {
              row.rentees.erase(time);
            });

            //increment to next spot
            spot++;
          }
          //remove spots form users
          auto user = users_table.begin();
          while (user != users_table.end()) {
            users_table.modify(user, _self, [&](auto& row) {
              row.spotRentals.erase(time);
            });
          }
          user++;
        }

        [[eosio::action]]
        void finish(uint64_t fMonth, uint64_t fDay, uint64_t fTime){    //As long as the back-end script feeds every proper 2 hour time, this works.
            require_auth(_self);
            auto auction = auctions_table.begin();
            while ( auction != auctions_table.end() ) {
                if(auction->fMonth == fMonth){
                    if(auction->fDay == fDay){
                        if(auction->fTime == fTime){
                            auto spot = spots_table.find(auction->spot.value);
                            auto owner = users_table.find(spot->owner.value);
                            if(auction->highestBid != 0){
                                std::string str_day = std::to_string(auction->uDay);
                                std::string str_month = std::to_string(auction->uMonth);
                                std::string str_time = std::to_string(auction->uTime);
                                std::string str_permis = str_month + "/" + str_day +"@" + str_time;
                                users_table.modify( owner, _self, [&]( auto& row ) {
                                    row.funds = owner->funds + auction->highestBid;
                                });
                                spots_table.modify( spot, _self, [&]( auto& row ) {
                                    const std::string tmp1 = str_permis;
                                    const name tmp2 = auction->currentBidder;
                                    row.rentees.insert(std::make_pair(tmp1, tmp2));
                                });
                                auto customer = users_table.find(auction->currentBidder.value);
                                users_table.modify( customer, _self, [&]( auto& row) {
                                    const std::string tmp1 = str_permis;
                                    const name tmp2 = auction->currentBidder;
                                    row.spotRentals.insert(std::make_pair(tmp1, tmp2));
                                });
                            }
                            auctions_table.erase(auction);
                            auction = auctions_table.begin();
                            continue;
                        }
                    }
                }
                auction++;
            }
        }

        [[eosio::action]]
        void bid(name userID, name auctionID, int bidAmount) {
            require_auth(userID);

            auto auction = auctions_table.find(auctionID.value);
            check(auction != auctions_table.end(), "That auction does not exist");
            check(bidAmount > auction->highestBid, "New bid is not high enough");
            auto user = users_table.find(userID.value);
            check(user != users_table.end(), "User does not exist");
            check(user->funds >= bidAmount, "You can't afford this bid");
            users_table.modify( user, _self, [&]( auto& row ) {
                row.funds = user->funds - bidAmount;
            });
            if( auction->highestBid != 0){ //no need to refund first time someone bids
                users_table.modify( users_table.find(auction->currentBidder.value), _self, [&]( auto& row ) {
                    row.funds = user->funds + auction->highestBid;
                });
            }
            auctions_table.modify( auction, _self, [&]( auto& row ) {
                row.highestBid = bidAmount;
                row.currentBidder = userID;
            });
        }

//Assigning a spot
        [[eosio::action]]
        void assignspot(name accountID, name spotID) {
            require_auth(_self);
            auto account = users_table.find(accountID.value);
            auto spot = spots_table.find(spotID.value);
            check(account != users_table.end(), "User did not exist");
            check(spot != spots_table.end(), "Spot did not exist");
            check(account->spot.to_string() == "", "This user already owns a spot");
            check(spot->owner.to_string() == "", "This spot already has an owner");
            users_table.modify( account, _self, [&]( auto& row ) {
                row.spot = spotID;
            });
            spots_table.modify( spot, _self, [&]( auto& row ) {
                row.owner = accountID;
            });
        }

        //Remove a spot
        [[eosio::action]]
        void removespot(name accountID) {
            require_auth(_self);
            auto account = users_table.find(accountID.value);
            check(account->spot.to_string() != "", "This user has no spot to remove");
            auto spot = spots_table.find(account->spot.value);
            check(account != users_table.end(), "User does not exist");
            check(spot != spots_table.end(), "Spot does not exist");
            users_table.modify( account, _self, [&]( auto& row ) {
                row.spot = name{""};
            });
            spots_table.modify( spot, _self, [&]( auto& row ) {
                row.owner = name{""};
            });
        }

//Adding Structs

        [[eosio::action]]
        void createuser(name accountID, uint64_t initialFunds, name spotID) {
            require_auth(_self);
            auto account = users_table.find(accountID.value);
            check(account == users_table.end(), "User already exists");
            users_table.emplace(_self, [&](auto& row) {
                row.ID = accountID;
                row.funds = initialFunds;
                row.spot = spotID;
		            row.spotRentals = std::map<std::string, name>();
            });
        }

        [[eosio::action]]
        void createspot(name spotID, name ownerID, uint64_t lot){
            require_auth(_self);
            auto checkSpot = spots_table.find(spotID.value);
            check( checkSpot == spots_table.end() , "Spot already exists");
            spots_table.emplace(_self, [&](auto& row) {
                row.ID = spotID;
                row.owner = ownerID; // ownerID must be a legitimate user but there is no check of such
                row.lot = lot;
                row.rentees = std::map<std::string, name>();
            });
        }

        [[eosio::action]]
        void createauc(name spotID, uint64_t uTime, uint64_t uDay, uint64_t uMonth){   // BUG: possible to put up an auction within the 24 hours of it
            check (uTime % 2 == 0, "Not a legitimate use time. Needs to be an even hour");
            auto spot = spots_table.find(spotID.value);
            check( spot != spots_table.end() , "That spot does not exist");
            require_auth(spot->owner); // This should check that the user exists
            std::string str_day = std::to_string(uDay);
            std::string str_month = std::to_string(uMonth);
            std::string str_time = std::to_string(uTime);
            switch(uMonth) {
                case 6  :
                    str_month = "a";
                    break; //optional
                case 7  :
                    str_month = "b";
                    break; //optional
                case 8  :
                    str_month = "c";
                    break; //optional
                case 9  :
                    str_month = "d";
                    break; //optional
            }
            switch(uDay) {
                case 6  :
                    str_day = "a";
                    break; //optional
                case 7  :
                    str_day = "b";
                    break; //optional
                case 8  :
                    str_day = "c";
                    break; //optional
                case 9  :
                    str_day = "d";
                    break; //optional
                case 16  :
                    str_day = "e";
                    break; //optional
                case 17  :
                    str_day = "f";
                    break; //optional
                case 18  :
                    str_day = "g";
                    break; //optional
                case 19  :
                    str_day = "h";
                    break; //optional
                case 26  :
                    str_day = "i";
                    break; //optional
                case 27  :
                    str_day = "j";
                    break; //optional
                case 28  :
                    str_day = "k";
                    break; //optional
                case 29  :
                    str_day = "l";
                    break; //optional
            }
            switch(uTime) {
                case 6  :
                    str_time = "a";
                    break; //optional
                case 8  :
                    str_time = "b";
                    break; //optional
                case 16  :
                    str_time = "c";
                    break; //optional
                case 18  :
                    str_time = "d";
                    break; //optional
            }
            std::string str_spotID = spotID.to_string();
            std::string str_aucID = str_spotID + "." + str_month + "." + str_day +"." + str_time; // Note that spotIDs can't be too long since 9 other chars are needed
            name auctionID = name{str_aucID};
            auto check = auctions_table.find(auctionID.value);
            if(check != auctions_table.end()){
                print("ERROR: no such auction");
                return;
            }
            auctions_table.emplace(_self, [&](auto& row) {
                row.ID = auctionID;
                row.spot = spotID;
                row.uTime = uTime;
                row.uDay = uDay;
                row.uMonth = uMonth;
                row.fTime = row.uTime;
                if(uMonth == 1){
                    if(uDay == 1){
                        row.fDay = 31;
                        row.fMonth = 12;
                    }
                    else{
                        row.fDay = row.uDay - 1;
                        row.fMonth = 1;
                    }
                }
                if(uMonth == 2 || uMonth == 4 || uMonth == 6 || uMonth == 8 || uMonth == 9 || uMonth == 11){
                    if(uDay == 1){
                        row.fDay = 31;
                        row.fMonth = row.uMonth - 1;;
                    }
                    else{
                        row.fDay = row.uDay - 1;
                        row.fMonth = row.uMonth;
                    }
                }
                if(uMonth == 5 || uMonth == 7 || uMonth == 10 || uMonth == 11){
                    if(uDay == 1){
                        row.fDay = 30;
                        row.fMonth = row.uMonth - 1;;
                    }
                    else{
                        row.fDay = row.uDay - 1;
                        row.fMonth = row.uMonth;
                    }
                }
                if(uMonth == 3){
                    if(uDay == 1){
                        row.fDay = 28;
                        row.fMonth = 1;;
                    }
                    else{
                        row.fDay = row.uDay - 1;
                        row.fMonth = 2;
                    }
                }
                row.highestBid = 0;
                row.currentBidder = ""_n;
            });
        }

        parkingdb(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds), users_table(receiver, receiver.value), spots_table(receiver, receiver.value), auctions_table(receiver, receiver.value) {}

    private:
        struct [[eosio::table]] spot_struct {
            name ID; // One letter for lot, two chars for spot identifier
            name owner; // must match user_struct::ID
            uint64_t lot;
	          std::map<std::string, name> rentees;

            uint64_t primary_key() const {
                return ID.value;
            }

	        uint64_t sec_key() const {
                return lot;
            }
        };

        struct [[eosio::table]] user_struct {
            name ID;
            name spot; // must match spot_struct::ID
            uint64_t funds;
	          std::map<std::string, name> spotRentals;

            uint64_t primary_key () const {
                return ID.value;
            }
        };

        struct [[eosio::table]] auction_struct {
            name ID; // Form of "{spot}.{month}.{day}.{time}"
            name spot; // must match spot_struct::ID
            uint64_t uTime;  // u = use
            uint64_t uDay;
            uint64_t uMonth;
            uint64_t fTime; // f = auction finish
            uint64_t fDay;
            uint64_t fMonth;
            uint64_t highestBid;
            name currentBidder; // must match user_struct::ID

            uint64_t primary_key() const {
                return ID.value;
            }

	        uint64_t sec_key() const {
                return highestBid;
            }

	        uint64_t third_key() const {
                return uTime;
            }

            uint64_t fourth_key() const {
                return uDay;
            }

            uint64_t fifth_key() const {
                return uMonth;
            }
        };

        typedef eosio::multi_index<"users"_n, user_struct> user_index;
        user_index users_table;

        typedef eosio::multi_index<"spots"_n, spot_struct,
                eosio::indexed_by<"secid"_n, eosio::const_mem_fun<spot_struct, uint64_t, &spot_struct::sec_key>>> spot_index;
        spot_index spots_table;

        typedef eosio::multi_index<"auctions"_n, auction_struct, //> auction_index;
		        eosio::indexed_by<"secid"_n, eosio::const_mem_fun<auction_struct, uint64_t, &auction_struct::sec_key>>,
		        eosio::indexed_by<"thirdid"_n, eosio::const_mem_fun<auction_struct, uint64_t, &auction_struct::third_key>>,
                eosio::indexed_by<"fourthid"_n, eosio::const_mem_fun<auction_struct, uint64_t, &auction_struct::fourth_key>>,
                eosio::indexed_by<"fifthid"_n, eosio::const_mem_fun<auction_struct, uint64_t, &auction_struct::fifth_key>>> auction_index;
        auction_index auctions_table;
};
