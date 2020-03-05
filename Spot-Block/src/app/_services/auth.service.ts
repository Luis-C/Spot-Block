import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../_models/user";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public currentUser: Observable<User>;

  constructor() {}
}
