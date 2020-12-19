import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  private authStatusListener = new Subject();
  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        if(token) {
          const expiresIn = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresIn * 1000);
          this.token = token;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/'])
        }
      })
  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer)
    this.router.navigate(['/']);
  }
}
