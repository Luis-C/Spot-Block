#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract("person")]] person : public eosio::contract {
    public:
        using contract::contract;

        [[eosio::action]]
        void bid(std::string spotID, int bidAmount) {
            //bit on a spot
            
        }
        
        [[eosio::action]]
        void pay(name userID, name receiverID, int amount) {
            //transfer payment
            //check auth and setup table
            require_auth(userID);
            user_index users_table(get_self(), get_first_receiver().value);
            auto pay_er = users_table.find(userID.value);
            auto receiver = users_table.find(receiverID.value);

            int hasEnough = 1;
            if (pay_er != users_table.end() && receiver != users_table.end()) {
                //Check if has enough and take money
                users_table.modify(pay_er, userID, [&](auto& row) {
                    if (row.funds >= amount) {
                        row.funds = row.funds - amount;
                    }
                    else {
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

        person(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds) {}

    private:
        struct [[eosio::table]] user {
            name ID;
            std::string spot;
            int funds;

            uint64_t primary_key () const {
                return ID;
            }
        };

        typedef eosio::multi_index<"users"_n, user> user_index;
};
