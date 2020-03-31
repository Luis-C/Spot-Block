var express = require('express');
var bodyParser = require('body-parser');
var chain_api = express();
chain_api.use(bodyParser.urlencoded({extended: true}));
chain_api.use(bodyParser.json());
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder

const defaultPrivateKey = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"; //eosio private key
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

chain_api.get('/test', function (req, res) {
  console.log("test");
  res.end("test");
});

chain_api.post('/insert', async function (req, res) {
  console.log("Call: insert");
  const currApi = new Api({rpc, JsSignatureProvider([req.body.privKey]), textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  const result = await api.transact({
    actions: [{
      account: 'spotblock',
      name: 'insert',
      authorization: [{
        actor: req.body.accountID,
        permission: 'active',
      }],
      data: {
        accountID: req.body.accountID,
        initialFunds: req.body.initialFunds,
        ownedSpot: req.body.ownedSpot,
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  res.end(result);
});

chain_api.post('/testPost', async function (req, res) {
  console.log("Call: testPost");
  console.log(req.body);
});


chain_api.post('/pay', async function (req, res) {
  console.log("Call: Pay");
  const currApi = new Api({rpc, JsSignatureProvider([req.body.privKey]), textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
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
        recieverID: req.body.recieverID,
        amount: req.body,amount,
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  res.end(result);
});

/*
chain_api.get('/createspot', async function (req, res) {
  console.log("Call: Create Spot");
  const result = await api.transact({
    actions: [{
      account: 'spotblock',
      name: 'create spot',
      authorization: [{
        
      }],
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  res.end(result);
});



chain_api.get('/finish', async function (req, res) {
  console.log("Call: Insert");
  const result = await api.transact({
    actions: [{
      account: 'spotblock',
      name: 'finish',
      authorization: [{
        actor: 'testBid1',
        permission: 'active',
      }],
      data: {
        accountID: 'testBid1',
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  res.end(result);
}); */


var server = chain_api.listen(9090, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("api is running on %s:%s", host, port);
});
