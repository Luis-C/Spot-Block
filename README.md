# Spot-Block

Parking bidding using blockchain

# Build for Deployment (GitHub Pages):

```Powershell
ng build --prod --output-path ../docs --base-href /Spot-Block/
```

Then copy and paste index.html and rename it 404.html

# Deploying the Full Stack

First, if you don't have a dist folder in /Spot-Block/, build the angular
project by running the following in /Spot-Block/

```Powershell
ng build --prod
```

Then in the directory with docker-compose.yml, run:

```Powershell
docker-compose up --build
```

Website: 80 Api: 9090 Blockchain: 8888 Prometheus: 9000 Grafana Dashboard: 3000

If you have an error mounting the directory, you need to go to your docker
settings and allow drive sharing.

In order to get into the container for any reason, run:

```Powershell
docker ps
```

Look for the id of the spot-block container. Then run

```Powershell
docker exec -it <id> bash
```

# How Our Project Works

Spot-Block is a Distributed Block-Chain Application with a website interface for
renting parking spots at Virginia Tech. Our MVP runs using Docker Containers. We
chose to use docker so that we could isolate and control our environment in
development, test integration, easily deploy our entire application on any
system and network multiple servers together. We used docker-compose to run
three containers on a virtual network. The main container runs our website,
backend as well as a single blockchain node. This container uses CentOS7 as an
operating system and uses Apache to host the website. On creation, this
container will have all the nodejs and angular dependencies required, nodeos and
some linux utilities installed. The compiled angular project will get copied to
web-root directory of the Apache server. Some scripts will get copied over to
the root directory and run when the container is started. These scripts start
the block-chain, apache server and api server as well as create several test
accounts and data to populate the block-chain tables for demo purposes. The
scripts contain code to configure the Apache server automatically. Two of the
scripts, finish.sh and expire.sh, will get set to run as a cronjob every 2
hours. The information required to use the test accounts is output to the main
log such as the keys for the test users. This is merely for test purposes. In an
actual deployment, none of the keys would be on the server, users would be in
charge of their wallets and only the website port, 80, would be exposed to the
world.

The other two docker containers that get setup are for collecting and displaying
analytics. Our api stores certain data about what endpoints are being hit and
how long requests are taking. It exposes these on a metrics endpoint. Then the
prometheus server scrapes these metrics from the api on the main app container.
Once prometheus scrapes the metrics, it parses them and puts them into a format
that the Grafana server can use. Grafana then grabs the data from prometheus and
displays them in graphs that you can customize. I used volumes for prometheus
and grafana which means that the data they have persists after you shut down the
containers. This data can be useful for monitoring performance and usage of the
application. Docker-compose allows all of the above to be done with one command.
The entire full-stack application can be up, accessible and ready to go with
docker-compose up --build. The simplicity of this deployment is the primary
factor for using docker.

The backend of our project consists of an api written in nodejs. This api is
primarily used for the angular frontend to perform actions on the block-chain.
However, the api contains endpoints for other actions on the block-chain that
the frontend would not use so that we can test the block-chain. The
functionality for the frontend reading information from the blockchain is
contained entirely in the angular frontend as the blockchain service. We have an
automated test suite for the api using postman. These tests can be imported from
the json file in our project. The keys will need to be swapped out with the
appropriate ones in order to sign the tests properly. There is an additional
test in the container to check the values in the block-chain after the postman
tests have run.

--- TODO: explain blockchain code

--- TODO: explain frontend code

Our front end was built using the Angular framework in conjunction with the
Material design component library. Following common strategies such as the Model
View Controller design pattern we've done our best to make each component both
modular and reusable. We've also considered separation of concerns while
designing the front end. For example, we've kept all communications with the
blockchain API encapsulated within a dedicated service. We also make use of a
notifications service to give feedback to the end user.

In terms of design choices, we wanted to pursue a novel approach and decided to
make most components translucent with a backdrop filter blur effect. Sadly,
backdrop filter is not widely supported by all browsers and as such an ideal
experience can only be guaranteed in a chrome browser. However, we did heavily
consider the mobile experience and can guarantee the web app looks and functions
properly in all common phones.
