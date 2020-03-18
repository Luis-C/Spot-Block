#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] spot : public contract {
    public:
        using contract::contract;

        [[eosio::action]]
        void rented(name tempOwner) {
            //set owner to rentee for time of renting

        }

        [[eosio::action]]
        void expire() {
            //set owner back to main owner

        }
};
