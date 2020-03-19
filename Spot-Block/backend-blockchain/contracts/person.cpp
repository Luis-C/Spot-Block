#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] person : public contract {
    public:
        using contract::contract;

        [[eosio::action]]
        void bid(std::string spotID, int bidAmount) {
            //bit on a spot
            
        }
        
        [[eosio::action]]
        void pay(name userID, person reveiver, int amount) {
            //transfer payment
            //check auth and take amount
            require_auth(userID);
            this.funds -= amount;
            
            //find person, give money
            receiver.funds += amount;
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
