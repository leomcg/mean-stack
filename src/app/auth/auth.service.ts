import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { NodeWithI18n } from "@angular/compiler";

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
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000)
          
          this.saveAuthData(token, expirationDate);
          
          this.setTokenExpirationTimer(expiresIn)

          this.token = token;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/'])
        }
      })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.setTokenExpirationTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);

    }
  }

  setTokenExpirationTimer(duration: number) {
    console.log('timer: ' + duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.deleteAuthData();
    this.router.navigate(['/']);
  }

  saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  deleteAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDateString = localStorage.getItem('expiration');

    if(!token || !expirationDateString) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDateString)
    }
  }
}
