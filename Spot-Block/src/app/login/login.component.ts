import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotificationsService } from "../_services/notifications.service";
import { AuthService } from "../_services/auth.service";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { BlockchainService } from "../_services/blockchain.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notif: NotificationsService,
    private auth: AuthService,
    private blockchain: BlockchainService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      id: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
          // Validate message isn't just whitespace
          Validators.pattern(".*\\S+.*"),
        ],
      ],
      key: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
          // Validate message isn't just whitespace
          Validators.pattern(".*\\S+.*"),
        ],
      ],
    });
  }

  async login() {
    // Test that the blockchain is active:
    this.blockchain.test().subscribe((resp) => console.log(resp));

    let isUser = await this.blockchain.isUser(this.loginForm.value.id);

    if (isUser) {
      this.auth
        .login(this.loginForm.value)
        .pipe(first())
        .subscribe(
          (data: string) => {
            this.router.navigate(["/home"]);
            this.blockchain.updateKey();
            this.notif.displayMessage(data);
          },
          (error) => {
            this.notif.displayMessage("invalid");
          }
        );
    } else {
      this.notif.displayMessage("Couldn't find you in the blockchain!");
    }

    console.log(await this.blockchain.getFunds());
  }
}
