# Spot-Block

Parking bidding using blockchain

# Build for Deployment (GitHub Pages):

```Powershell
ng build --prod --output-path ../docs --base-href /Spot-Block/
```

Then copy and paste index.html and rename it 404.html

# Deploying the Full Stack

First, if you don't have a dist folder in /Spot-Block/, build the angular project by running the following
in /Spot-Block/

```Powershell
ng build --prod
```

Then in the directory with docker-compose.yml, run:

```Powershell
docker-compose up --build
```
Website: 80
Api: 9090
Blockchain: 8888
Prometheus: 9000
Grafana Dashboard: 3000

If you have an error mounting the directory, you need to go to your docker settings and allow drive sharing.
