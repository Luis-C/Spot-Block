import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Person } from "../_models/person";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public currentUser: Observable<Person>;

  constructor() {}
}
