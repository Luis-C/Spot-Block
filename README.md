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
run -p 80:80 -p 8888:8888 -it <docker name>/<name you used>
```

this will take you into a shell in the container there will be a bash script in
your working directory it starts the blockchain, sets up a wallet, and starts ng
serve along with some other stuff you should then be able to see the website on
localhost:80
