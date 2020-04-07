user=$(cleos get table spotblock spotblock users | grep  '"ID": "user1"' -A 2 | grep funds)
if [[ "$user"=='"funds": 18' ]]; then
  echo "user funds correct";
else
  echo "user funds incorrect";
fi
user=$(cleos get table spotblock spotblock users | grep  '"ID": "user1"' -A 2 | grep spot)
if [[ "$user"=='"spot": "111",' ]]; then
  echo "user spot correct";
else
  echo "user spot incorrect";
fi

auction=$(cleos get table spotblock spotblock auctions | grep '"ID": "111.1.1.2"' -A 9)
auction_spot=$(echo "$auction" | grep spot)
str='"spot": "111",'
if [[ "$auction_spot" == *$str* ]]; then
  echo "auction spot correct";
else
  echo "auction spot incorrect";
fi

auction_utime=$(echo "$auction" | grep uTime)
str='"uTime": 2,'
if [[ "$auction_utime" == *$str* ]]; then
  echo "auction uTime correct";
else
  echo "auction uTime incorrect";
fi

auction_uDay=$(echo "$auction" | grep uDay)
str='"uDay": 1,'
if [[ "$auction_uDay" == *$str* ]]; then
  echo "auction uDay correct";
else
  echo "auction uDay incorrect";
fi

auction_uMonth=$(echo "$auction" | grep uMonth)
str='"uMonth": 1,'
if [[ "$auction_uMonth" == *$str* ]]; then
  echo "auction uMonth correct";
else
  echo "auction uMonth incorrect";
fi

auction_fTime=$(echo "$auction" | grep fTime)
str='"fTime": 2,'
if [[ "$auction_fTime" == *$str* ]]; then
  echo "auction fTime correct";
else
  echo "auction fTime incorrect";
fi

auction_fDay=$(echo "$auction" | grep fDay)
str='"fDay": 31,'
if [[ "$auction_fDay" == *$str* ]]; then
  echo "auction fDay correct";
else
  echo "auction fDay incorrect";
fi

auction_fMonth=$(echo "$auction" | grep fMonth)
str='"fMonth": 12,'
if [[ "$auction_fMonth" == *$str* ]]; then
  echo "auction fMonth correct";
else
  echo "auction fMonth incorrect";
fi

auction_bid=$(echo "$auction" | grep highestBid)
str='"highestBid": 2,'
if [[ "$auction_bid" == *$str* ]]; then
  echo "auction bid correct";
else
  echo "auction bid incorrect";
fi

auction_bidder=$(echo "$auction" | grep currentBidder)
str='"currentBidder": "user1"'
if [[ $auction_bidder == *$str* ]]; then
  echo "auction bidder correct";
else
  echo "auction bidder incorrect";
fi

