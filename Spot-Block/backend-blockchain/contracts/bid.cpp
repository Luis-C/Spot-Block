#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] bid : public eosio::contract {
    public:
        using contract::contract

        [[eosio::action]]
        void finish() {
            //close the bid, rent spot if there was a bid
            
        }

        

    private:
        struct [[eosio::table]] bid_struct {
            name ID;
            name spot;
            std::string time;
            int highestBid;
            name currentBidder;

            uint64_t primary_key() const {
                return ID.value;
            }
        }
}
