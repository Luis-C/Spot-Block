# Spot-Block

Parking bidding using blockchain

# Build for Deployment (GitHub Pages):

```Powershell
ng build --prod --output-path ../docs --base-href /Spot-Block/
```

Then copy and paste index.html and rename it 404.html

# Deploying the Full Stack

First build the angular project by running the following
in /Spot-Block/

```Powershell
ng build --prod
```

In order to run everything you'll need docker. Once that is installed, go to
the directory with the Dockerfile. Run the command:

```Powershell
docker build -t <your docker name>/<name for your container> .
# note the . is important
```

then run this:

```
docker run -p 80:80 -p 8888:8888 -p 9090:9090 -it <docker name>/<name you used>
```

This will take you into a shell in the container. Run: 
```Powershell
./start_up.sh
./create_test_accounts.sh
```
This should create 50 test spot accounts in the spots table. The spotblock account is the contract owner and all associated keys should be in the main directory. 6 test users accounts will be in the test_users directory with relevant key files.

To start the website, run the following:
```Powershell
httpd -D FOREGROUND
```
You can now access the website at localhost:80.
You can check the blockchain on localhost:8888/v1/chain/get_info.
The api is accessible on localhost:9090.

Tables can be checked with the following command:
```Powershell
cleos get table spotblock spotblock <table name>
```
