import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }
  
  onLogin(loginForm: NgForm) {
    if(loginForm.invalid) {
      return;
    }
    this.auth.login(loginForm.value.email, loginForm.value.password)
  }
}
