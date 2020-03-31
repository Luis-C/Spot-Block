var express = require('express');
var bodyParser = require('body-parser');
var chain_api = express();

chain_api.use(bodyParser.urlencoded({extended: true}));
chain_api.use(bodyParser.json());

const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });

/*
 * test it is running
 */
chain_api.get('/test', function (req, res) {
  console.log("test");
  res.end("test");
});

/*
 * fields should be key, user, account, fund, and spot
 * user must be spotblock
 */
chain_api.post('/createUser', async(req, res) => {
  console.log("Call: createUser");
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  try {
    const result = await api.transact({
      actions: [{
        account: 'spotblock',
        name: 'createuser',
        authorization: [{
          actor: req.body.user,
          permission: 'active',
        }],
        data: {
          accountID: req.body.account,
          initialFunds: req.body.funds,
          spotID: req.body.spot,
       },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    console.log("account added");
    res.end("Account is added");
  } catch(e) {
    console.log("error");
    console.log(e.message);
    res.end(JSON.stringify(e.json, null, 2));
  }
});

/*
 * fields should be key, user, id, owner, lot, and coord
 * user must be spotblock
 */
chain_api.post('/createSpot', async(req, res) => {
  console.log("Call: createSpot");
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  try {
    const result = await api.transact({
      actions: [{
        account: 'spotblock',
        name: 'createspot',
        authorization: [{
          actor: req.body.user,
          permission: 'active',
        }],
        data: {
          id: req.body.id,
          owner: req.body.owner,
          lot: req.body.lot,
          coord: req.body.coord,
       },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    console.log("spot added");
    res.end("Spot is added");
  } catch(e) {
    console.log("error");
    console.log(e.message);
    res.end(e.message);
  }
});

/*
 *  fields should be key, user, spotid and use_time
 */
chain_api.post('/createAuc', async(req, res) => {
  console.log("Call: createAuc");
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  try {
    const result = await api.transact({
      actions: [{
        account: 'spotblock',
        name: 'createauc',
        authorization: [{
          actor: req.body.user,
          permission: 'active',
        }],
        data: {
          spotid: req.body.spotid,
          use_time: req.body.use_time,
       },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    console.log("auction added");
    res.end("Auction is added");
  } catch(e) {
    console.log("error");
    console.log(e.message);
    res.end(e.message);
  }
});

/*
 * fields should be key, user, accountid, and spotid
 */
chain_api.post('/assignSpot', async(req, res) => {
  console.log("Call: assignSpot");
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  try {
    const result = await api.transact({
      actions: [{
        account: 'spotblock',
        name: 'assignspot',
        authorization: [{
          actor: req.body.user,
          permission: 'active',
        }],
        data: {
          accountID: req.body.accountid,
          spotID: req.body.spotid,
       },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    console.log("Spot assigned");
    res.end("Spot assigned.");
  } catch(e) {
    console.log("error");
    console.log(e.message);
    res.end(e.message);
  }
});

/*
 * fields should be key, user, userid, auctionid, bidamount
 */
chain_api.post('/bid', async(req, res) => {
  console.log("Call: bid");
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  try {
    const result = await api.transact({
      actions: [{
        account: 'spotblock',
        name: 'bid',
        authorization: [{
          actor: req.body.user,
          permission: 'active',
        }],
        data: {
          userID: req.body.userid,
          auctionID: req.body.auctionid,
          bidAmount: req.body.bidamount,
       },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    console.log("Bid placed");
    res.end("Bid placed.");
  } catch(e) {
    console.log("error");
    console.log(e.message);
    res.end(e.message);
  }
});

/*
 * fields should be key, userID, receiverID, amount
 */
chain_api.post('/pay', async function (req, res) {
  console.log("Call: Pay");
  const signatureProvider = new JsSignatureProvider([req.body.key]);
  const api = new Api({rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  try {
    const result = await api.transact({
      actions: [{
        account: 'spotblock',
        name: 'pay',
        authorization: [{
          actor: req.body.userID,
          permission: 'active',
        }],
        data: {
          userID: req.body.userID,
          receiverID: req.body.receiverID,
          amount: req.body.amount,
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
    res.end("Paid");
  } catch(e) {
    console.log("error");
    console.log(e.message);
    res.end(e.message);
  }
})

//starts server on 9090
var server = chain_api.listen(9090, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("api is running on %s:%s", host, port);
});
