#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] spot : public contract {
    public:
        using contract::contract;

        [[eosio::action]]
        void putForRent(std::string time) {
            //create a bit

        }


    private:
        struct [[eosio::table]] spot {
            name ID;
            name owner;
            std::string lot;
            std::string coord;
            name rentee;
            std::string time;

            uint64_t primary_key() const {
                return ID.value;
            }
        }
};
