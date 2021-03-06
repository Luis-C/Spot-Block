import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Person } from "../_models/person";
import { BlockchainService } from "./blockchain.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Person>;
  public currentUser: Observable<Person>;
  private currentKeySubject: BehaviorSubject<string>;
  public currentKey: Observable<string>;

  constructor() {
    // User
    this.currentUserSubject = new BehaviorSubject<Person>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
    // Key
    this.currentKeySubject = new BehaviorSubject<string>(
      JSON.parse(localStorage.getItem("currentKey"))
    );
    this.currentKey = this.currentKeySubject.asObservable();
  }

  public get currentUserValue(): Person {
    return this.currentUserSubject.value;
  }

  public get currentKeyValue(): string {
    return this.currentKeySubject.value;
  }

  /**
   * Save user info into session storage
   * NOTE: Validation is done by the blockchain service
   * @param user info to be saved
   */
  login(user: any) {
    return new Observable((subscriber) => {
      // valid login
      // TODO: do something with this person?
      // FIXME: session storage does not save an accurate copy of the user from
      // the blockchain
      const person: Person = { ID: user.id, funds: 20, spot: null };

      localStorage.setItem("currentUser", JSON.stringify(person));
      this.currentUserSubject.next(person);
      // set key
      localStorage.setItem("currentKey", JSON.stringify(user.key));
      this.currentKeySubject.next(user.key);

      // notify login was successful
      subscriber.next("Logged in!");
    });
  }

  /**
   * Set observables to null and clear session storage
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);

    localStorage.removeItem("currentKey");
    this.currentKeySubject.next(null);

    // clear session storage
    location.reload();
  }
}
