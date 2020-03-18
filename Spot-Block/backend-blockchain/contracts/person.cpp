#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] person : public contract {
    public:
        using contract::contract;

        [[eosio::action]]
        void bid(name spot, int bidAmmount) {
            //bit on a spot

        }
        
        [[eosio::action]]
        void pay(name reciever, int ammount) {
            //transfer payment

        }
};
