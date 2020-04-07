var express = require("express");
var bodyParser = require("body-parser");
var chain_api = express();

chain_api.use(bodyParser.urlencoded({ extended: true }));
chain_api.use(bodyParser.json());

const Prometheus = require('prom-client');
const { Api, JsonRpc, RpcError } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig"); // development only
const fetch = require("node-fetch"); // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require("util"); // node only; native TextEncoder/Decoder

const rpc = new JsonRpc("http://127.0.0.1:8888", { fetch });

const metricsInterval = Prometheus.collectDefaultMetrics()
const testTotal = new Prometheus.Counter({
  name: 'test_total',
  help: 'total number of test hits',
  labelNames: ['test']
});

const createUserTotal = new Prometheus.Counter({
  name: 'createUser_total',
  help: 'total number of createUser hits',
  labelNames: ['createUser']
});

const createAucTotal = new Prometheus.Counter({
  name: 'createAuc_total',
  help: 'total number of createAuc hits',
  labelNames: ['createAuc']
});

const createSpotTotal = new Prometheus.Counter({
  name: 'createSpot_total',
  help: 'total number of createSpot hits',
  labelNames: ['createSpot']
});

const bidTotal = new Prometheus.Counter({
  name: 'bid_total',
  help: 'total number of bid hits',
  labelNames: ['bid']
});

const assignTotal = new Prometheus.Counter({
  name: 'assign_total',
  help: 'total number of assign hits',
  labelNames: ['assign']
});

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
});

/*chain_api.use(function(req, res) {
  res.locals.startEpoch = Date.now();
});*/

/*
 * test it is running
 */
chain_api.get("/test", function(req, res) {
  console.log("test");
  testTotal.inc();
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({response: "test"}));
});

/*
 * expose metrics
 */
chain_api.get("/metrics", function(req, res) {
  res.set('Content-Type', Prometheus.register.contentType);
  res.end(Prometheus.register.metrics());
});

/*
 * fields should be key, user, account, fund, and spot
 * user must be spotblock
 */
chain_api.post("/createUser", async (req, res) => {
  console.log("Call: createUser");
  createUserTotal.inc();
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  try {
    const result = await api.transact(
      {
        actions: [
          {
            account: "spotblock",
            name: "createuser",
            authorization: [
              {
                actor: req.body.user,
                permission: "active"
              }
            ],
            data: {
              accountID: req.body.account,
              initialFunds: req.body.funds,
              spotID: req.body.spot
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    console.log("account added");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: "Account is added"}));
  } catch (e) {
    console.log("error");
    console.log(e.message);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: e.message}));
  }
});

/*
 * fields should be key, user, id, owner, and lot
 * user must be spotblock
 */
chain_api.post("/createSpot", async (req, res) => {
  console.log("Call: createSpot");
  createSpotTotal.inc();
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  try {
    const result = await api.transact(
      {
        actions: [
          {
            account: "spotblock",
            name: "createspot",
            authorization: [
              {
                actor: req.body.user,
                permission: "active"
              }
            ],
            data: {
              spotID: req.body.id,
              ownerID: req.body.owner,
              lot: req.body.lot
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    console.log("spot added");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: "Spot is added"}));
  } catch (e) {
    console.log("error");
    console.log(e.message);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: e.message}));
  }
});

/*
 *  fields should be key, user, spotid, time, day, and month
 */
chain_api.post("/createAuc", async (req, res) => {
  console.log("Call: createAuc");
  createAucTotal.inc();
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  try {
    const result = await api.transact(
      {
        actions: [
          {
            account: "spotblock",
            name: "createauc",
            authorization: [
              {
                actor: req.body.user,
                permission: "active"
              }
            ],
            data: {
              spotID: req.body.spotid,
              uTime: req.body.time,
              uDay: req.body.day,
              uMonth: req.body.month
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    console.log("auction added");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: "Auction is added"}));
  } catch (e) {
    console.log("error");
    console.log(e.message);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: e.message}));
  }
});

/*
 * fields should be key, user, accountid, and spotid
 */
chain_api.post("/assignSpot", async (req, res) => {
  console.log("Call: assignSpot");
  assignTotal.inc();
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  try {
    const result = await api.transact(
      {
        actions: [
          {
            account: "spotblock",
            name: "assignspot",
            authorization: [
              {
                actor: req.body.user,
                permission: "active"
              }
            ],
            data: {
              accountID: req.body.accountid,
              spotID: req.body.spotid
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    console.log("Spot assigned");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: "Spot assigned"}));
  } catch (e) {
    console.log("error");
    console.log(e.message);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: e.message}));
  }
});

/*
 * fields should be key, user, userid, auctionid, bidamount
 */
chain_api.post("/bid", async (req, res) => {
  console.log("Call: bid");
  bidTotal.inc();
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  try {
    const result = await api.transact(
      {
        actions: [
          {
            account: "spotblock",
            name: "bid",
            authorization: [
              {
                actor: req.body.user,
                permission: "active"
              }
            ],
            data: {
              userID: req.body.userid,
              auctionID: req.body.auctionid,
              bidAmount: req.body.bidamount
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    console.log("Bid placed");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: "Bid placed"}));
  } catch (e) {
    console.log("error");
    console.log(e.message);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({response: e.message}));
  }
});

//starts server on 9090
var server = chain_api.listen(9090, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("api is running on %s:%s", host, port);
});
