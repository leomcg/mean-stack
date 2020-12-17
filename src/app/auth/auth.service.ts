import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:3000/api/user/'

  constructor(
    private http: HttpClient
  ) { }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post(this.url + 'signup', authData)
      .subscribe(response => {
        console.log(response)
      })
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post(this.url + 'login', authData)
      .subscribe(response => {
        console.log(response)
      })
  }
}
