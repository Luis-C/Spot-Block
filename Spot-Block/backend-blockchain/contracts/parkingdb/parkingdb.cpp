#include <eosio/eosio.hpp>
//#include "spot.cpp"

using namespace eosio;

class [[eosio::contract("parkingdb")]] parkingdb : public eosio::contract {
    public:
        using contract::contract;


// DEBUG FUNCTIONS
        [[eosio::action]]
        void debugutable(){
            for ( auto itr = users_table.begin(); itr != users_table.end(); itr++ ) {
                print("{ ");
                print("ID: ");
                print(itr->ID);
                print(", SPOT: ");
                print(itr->spot);
                print(", FUNDS: ");
                print(itr->funds);\
                print(" } ");
            }
        }

        [[eosio::action]]
        void debugstable(){
            for ( auto itr = spots_table.begin(); itr != spots_table.end(); itr++ ) {
                print("{ ");
                print("ID: ");
                print(itr->ID);
                print(", OWNER: ");
                print(itr->owner);
                print(", LOT: ");
                print(itr->lot);
                print(", COORD: ");
                print(itr->coord);
                print(", RENTEE: ");
                print(itr->rentee);
                print(", TIME: ");
                print(itr->time);
                print(" } ");
            }
        }

        [[eosio::action]]
        void debugatable(){
            for ( auto itr = auctions_table.begin(); itr != auctions_table.end(); itr++ ) {
                print("{ ");
                print("ID: ");
                print(itr->ID);
                print(", SPOT: ");
                print(itr->spot);
                print(", USE_TIME: ");
                print(itr->use_time);
                print(", FINISH_TIME: ");
                print(itr->finish_time);\
                print(", HIGHESTBID: ");
                print(itr->highestBid);\
                print(", CURRENTBIDDER: ");
                print(itr->currentBidder);\
                print(" } ");
            }
        }

//FUCTIONALITY ACTIONS

        [[eosio::action]]
        void finish(name auctionID){
            require_auth(_self);
            auto auction = auctions_table.find(auctionID.value);
            auto spot = spots_table.find(auction->spot.value);
            auto owner = users_table.find(spot->owner.value);
            users_table.modify( owner, _self, [&]( auto& row ) {
                row.funds = owner->funds + auction->highestBid;
            });
            spots_table.modify( spot, _self, [&]( auto& row ) {
                row.rentees.insert({auction.use_time, auction->currentBidder};
            });
            auctions_table.erase(auction);
        }

        [[eosio::action]]
        void bid(name userID, name auctionID, int bidAmount) {
            require_auth(userID);

            auto auction = auctions_table.find(auctionID.value);
            if(auction != auctions_table.end()){
                if (bidAmount > auction->highestBid){
                    auto user = users_table.find(userID.value);
                    if (user != users_table.end()){
                        if(user->funds >= bidAmount){
                            users_table.modify( user, _self, [&]( auto& row ) {
                                row.funds = user->funds - bidAmount;
                            });             //Do race conditions exist for blockchains??
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
                        else{
                            print("You can't afford this bid");
                        }
                    }
                    else{
                        print("User does not exist");
                    }
                }
                else{
                    print("New bid is not high enough");
                }
            }
            else{
                print("That auction does not exist");
            }
        }

        [[eosio::action]] //TODO: I think delete this??
        void pay(name userID, name receiverID, int amount) {
            //transfer payment
            //check auth and setup table
            require_auth(userID);
            auto pay_er = users_table.find(userID.value);
            auto receiver = users_table.find(receiverID.value);
            // TODO: undefined behavior of when the received isn't in the table
            int hasEnough = 1;
            if (pay_er != users_table.end() && receiver != users_table.end()) {
                //Check if has enough and take money
                users_table.modify(pay_er, userID, [&](auto& row) {
                    if (row.funds >= amount) {
                        row.funds = row.funds - amount;
                    }
                    else {
                        print("Error: Transaction failed. User does not have enough money for this transaction.");
                        hasEnough = 0;
                    }
                });
                //pay money if had enough
                users_table.modify(receiver, receiverID, [&](auto& row) {
                    if (hasEnough == 1) {
                        row.funds = row.funds + amount;
                    }
                });
            }
        }

//Assigning a spot
        [[eosio::action]]
        void assignspot(name accountID, name spotID) {
            require_auth(_self);
            auto account = users_table.find(accountID.value);
            auto spot = spots_table.find(spotID.value);
            if (account != users_table.end() && spot != spots_table.end()) {
                users_table.modify( account, _self, [&]( auto& row ) {
                    row.spot = spotID;
                });
                spots_table.modify( spot, _self, [&]( auto& row ) {
                    row.owner = accountID;
                });
            }
            else {
                print("User or Spot did not exist");
            }
        }
//Adding Structs

        [[eosio::action]]
        void createuser(name accountID, int initialFunds, name spotID) {
            require_auth(_self);
            auto account = users_table.find(accountID.value);
            if (account == users_table.end()) {
                users_table.emplace(_self, [&](auto& row) {
                    row.ID = accountID;
                    row.funds = initialFunds;
                    row.spot = spotID;
                });
            }
            else {
                print("Error: Account already exists.");
            }
        }

        [[eosio::action]]
        void createspot(name id, name owner, std::string lot, std::string coord){
            require_auth(_self);
            auto check = spots_table.find(id.value);
            if( check == spots_table.end() ){
                spots_table.emplace(_self, [&](auto& row) {
                        row.ID = id;
                        row.owner = owner;
                        row.lot = lot;
                        row.coord = coord;
                        row.rentees<std::string, std::string> = {};
                });
            }

        }

        [[eosio::action]]
        void createauc(name spotid, std::string use_time){ //TODO: need to be able to assign a created spot to a created user, where neither had posession of the other during creations
            auto spot = spots_table.find(spotid.value);
            if( spot != spots_table.end() ){
                require_auth(spot->owner);
                auto check = auctions_table.find(spotid.value);
                if( check == auctions_table.end() ){
                    auctions_table.emplace(_self, [&](auto& row) {
                        row.ID = spotid; //TODO: diff naming scheme so a spot can be auctioned for two times?
                        row.spot = spotid;
                        row.use_time = use_time;
                        row.finish_time = "TODO"; //TODO: IDK how to do time
                        row.highestBid = 0;
                        row.currentBidder = ""_n; //TODO: potential change to allow spot auction for same time on 2 different days
                    });
                }


            }
            else{
                print("That spot does not exist");
            }

        }

        parkingdb(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds), users_table(receiver, receiver.value), spots_table(receiver, receiver.value), auctions_table(receiver, receiver.value) {}

    private:
        struct [[eosio::table]] spot_struct {
            name ID;
            name owner;
            std::string lot;
            std::string coord;
	    std::string currentRentee;
	    std::string currentTime;
	    std::map rentees;

            uint64_t primary_key() const {
                return ID.value;
            }

	    std::string sec_key() const {
                return lot;
            }

	    std::string third_key() const {
                 return coord;
	    }
        };

        struct [[eosio::table]] user {
            name ID;
            name spot;
            int funds;

            uint64_t primary_key () const {
                return ID.value;
            }
        };

        struct [[eosio::table]] auction_struct {
            name ID;
            name spot;
            std::string use_time; //use_time+2 hours
            std::string finish_time;
            int highestBid;
            name currentBidder;

            uint64_t primary_key() const {
                return ID.value;
            }

	    int sec_key() const {
                return highestBid;
            }

	    std::string third_key const {
                return use_time;
            }
        };

        typedef eosio::multi_index<"users"_n, user> user_index;
        user_index users_table;

        typedef eosio::multi_index<"spots"_n, spot_struct,
		eosio::indexed_by<"secid"_n, eosio::const_mem_fun<spot_struct, std::string, &spot_struct::sec_key>>
		eosio::indexed_by<"thirdid"_n, eosio::const_mem_fun<spot_struct, std::string, &spot_struct::third_key>>> spot_index;
        spot_index spots_table;

        typedef eosio::multi_index<"auctions"_n, auction_struct,
		eosio::indexed_by<"secid"_n, eosio::const_mem_fun<auction_struct, int, &auction_struct::sec_key>>,
		eosio::indexed_by<"thirdid"_n, eosio::const_mem_fun<auction_struct, std::string, &auction_struct::third_key>>> auction_index;
        auction_index auctions_table;
};
