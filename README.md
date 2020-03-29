# Spot-Block

Parking bidding using blockchain

# Build for Deployment (GitHub Pages):

```Powershell
ng build --prod --output-path ../docs --base-href /Spot-Block/
```

Then copy and paste index.html and rename it 404.html

# Docker

So in order to run everything you'll need docker. Once that is installed, go to
the directory with the Dockerfile. Run the command:

```Powershell
docker build -t <your docker name>/<name for your container> .
# note the . is important
```

then run this:

```
docker run -p 80:80 -p 8888:8888 -p 9090:9090 -it <docker name>/<name you used>
```

this will take you into a shell in the container there will be a bash script in
your working directory it starts the blockchain, sets up a wallet, etc... To serve
the website for testing, use ng serve --host 0.0.0.0 --port 80. You should then be 
able to see the website on localhost:80. You can also use a REST client such as 
Postman to hit localhost:9090/test to check the api. You can check the blockchain
on localhost:8888/v1/chain/get_info.
