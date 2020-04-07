import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Person } from "../_models/person";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Person>;
  public currentUser: Observable<Person>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<Person>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Person {
    return this.currentUserSubject.value;
  }

  login(user: any) {
    return new Observable((subscriber) => {
      if (this.isUser(user)) {
        //valid login
        const person: Person = { ID: user.id, funds: 20, spot: null };
        localStorage.setItem("currentUser", JSON.stringify(person));
        // setTimeout(() => {
        subscriber.next("Logged in!");
        this.currentUserSubject.next(person);
      }
      // }, 1000);
      // } else {
      //   //reject
      //   setTimeout(() => {
      //     subscriber.error('invalid');
      //   }, 1000);
      // }
    });
  }

  private isUser(user): boolean {
    return true;
    // TODO: validate in the blockchain
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
