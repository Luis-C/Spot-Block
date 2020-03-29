var express = require('express');
var chain_api = express();
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

chain_api.get('/insert', async function (req, res) {
  console.log("Call: insert");
  const result = await api.transact({
    actions: [{
      account: 'spotblock',
      name: 'insert',
      authorization: [{
        actor: 'test1',
        permission: 'active',
      }],
      data: {
        accountID: 'test1',
        initialFunds: 20,
        ownedSpot: '',
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  res.end(result);
});

var server = chain_api.listen(9090, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("api is running on %s:%s", host, port);
});
