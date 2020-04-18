#list of test users
declare -a users=("user1"
                  "user2"
                  "user3"
                  "user4"
                  "user5"
                  "user6")
mkdir test_users
cd test_users

#create wallet for each user
for i in "${users[@]}"
do
  mkdir "$i"
  cd "$i"
  #create user wallet
  cleos wallet create --file password.txt -n "${i}_wallet"
  cleos wallet open -n "${i}_wallet"
  cleos wallet unlock -n "${i}_wallet" < password.txt
  #get wallet public key
  cleos wallet create_key -n "${i}_wallet" > pub_key.txt
  echo "$(cat pub_key.txt | cut -d '"' -f 2)" > pub_key.txt
  #wallet private key
  cleos wallet private_keys -n "${i}_wallet" < password.txt | grep "\"" | sed -n 2p | cut -d '"' -f 2 > priv_key.txt
  #import eosio private key???
  echo "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3" | cleos wallet import -n "${i}_wallet"
  cleos create account eosio "$i" $(cat pub_key.txt)
  #go back up a dir
  cd ..
done

cd ..

#create test spots
cleos wallet unlock < password.txt
for ((i=1; i<=2; i++)); do
  for ((j=1; j<=5; j++)); do
    for ((k=1; k<=5; k++)); do
      cleos push action spotblock createspot '["'${i}${j}${k}'", "", 0]' -p spotblock@active
    done
  done
done

#insert test users
cleos push action spotblock createuser '["user1", 20, ""]' -p spotblock@active
cleos push action spotblock createuser '["user2", 5, ""]' -p spotblock@active
cleos push action spotblock createuser '["user3", 25, ""]' -p spotblock@active
cleos push action spotblock assignspot '["user1", "111"]' -p spotblock@active
cleos push action spotblock assignspot '["user2", "112"]' -p spotblock@active
#create test auctions
cleos push action spotblock createauc '["111", 4, 14, 4]' -p user1@active
cleos push action spotblock createauc '["112", 6, 14, 4]' -p user2@active

#give us the keys for test
cat test_users/user1/priv_key.txt
cat test_users/user2/priv_key.txt
cat test_users/user3/priv_key.txt
cat test_users/user4/priv_key.txt
cat test_users/user5/priv_key.txt
cat test_users/user6/priv_key.txt
