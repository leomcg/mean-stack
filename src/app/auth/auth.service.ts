import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  private authStatusListener = new Subject();
  private userNameSubject = new Subject();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private userName: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserNameSubject() {
    return this.userNameSubject.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }

  createUser(email: string, name: string, password: string) {
    const signupData = {email: email, name: name, password: password};
    this.http.post(BACKEND_URL + "signup", signupData)
     .subscribe(response => {
       this.login(email, password);
       this.router.navigate(['/']);
     }, error => {
       this.authStatusListener.next(false);
     })
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userName: string, userId: string }>(BACKEND_URL + "login", authData)
      .subscribe(response => {
        const token = response.token;
        if(token) {
          const expiresIn = response.expiresIn;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000)
          this.setTokenExpirationTimer(expiresIn)
          
          this.token = token;
          this.userName = response.userName,
          this.userNameSubject.next(this.userName);
          this.userId = response.userId,
          this.saveAuthData(token, expirationDate, this.userId);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/'])
        }
      }, error => {
        this.authStatusListener.next(false);
      })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.userId = authInformation.userId;
      this.token = authInformation.token;
      this.setTokenExpirationTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);

    }
  }

  setTokenExpirationTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.deleteAuthData();
    this.router.navigate(['/login']);
  }

  saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());

  }

  deleteAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expirationDateString = localStorage.getItem('expiration');

    if(!token || !expirationDateString) {
      return;
    }

    return {
      userId: userId,
      token: token,
      expirationDate: new Date(expirationDateString)
    }
  }
}
