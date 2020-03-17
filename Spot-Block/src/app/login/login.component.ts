import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotificationsService } from "../_services/notifications.service";

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
  }
}
