#!/bin/bash

#start keosd
keosd &

#start nodeos on 0.0.0.0 port 8888
nodeos -e -p eosio \
--plugin eosio::producer_plugin \
--plugin eosio::producer_api_plugin \
--plugin eosio::chain_api_plugin \
--plugin eosio::http_plugin \
--plugin eosio::history_plugin \
--plugin eosio::history_api_plugin \
--filter-on="*" \
--access-control-allow-origin='*' \
--contracts-console \
--http-validate-host=false \
--http-server-address 0.0.0.0:8888 \
--verbose-http-errors >> nodeos.log 2>&1 &

#create default wallet
cleos wallet create --file password.txt
cleos wallet open
cleos wallet unlock < password.txt
#get wallet public key
cleos wallet create_key > pub_key.txt
echo "$(cat pub_key.txt | cut -d '"' -f 2)" > pub_key.txt
#import eosio private key
echo "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3" | cleos wallet import
#create accounts
#cleos create account eosio spotblock $(cat pub_key.txt)
#cleos create account eosio test1 $(cat pub_key.txt)  
#add more accounts here ...
#
#
#add code 
#cleos set code spotblock /var/www/contracts/person.wasm
#cleos set abi spotblock /var/www/contracts/person.abi
#start up the angular project, this is for testing only
cd /var/www/html
ng serve --host 0.0.0.0 --port 80
#start up apache for production 

#keep everything alive
#tail -f /dev/null
