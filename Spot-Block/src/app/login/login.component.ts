import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotificationsService } from "../_services/notifications.service";
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

declare function require(name:string);
const fetch = require('node-fetch');

const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
const privateKey = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3";
const signatureProvider = new JsSignatureProvider([privateKey]);
const api = new Api({rpc, signatureProvider});


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private notif: NotificationsService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      id: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
          // Validate message isn't just whitespace
          Validators.pattern(".*\\S+.*")
        ]
      ],
      key: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
          // Validate message isn't just whitespace
          Validators.pattern(".*\\S+.*")
        ]
      ]
    });
  }

  login() {
    this.notif.notImplemented();
    console.log(this.loginForm.value);

    // TODO: send form to the backend
    const result = await api.transact({
      actions: [{
        account: 'spotblock',
        name: 'insert',
        authorization: [{
          actor: 'test2',
          permission: 'active',
        }],
        data: {
          accountID: 'test2',
          initialFunds: 20,
          ownedSpot: '',
        },
      }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
  }
}
