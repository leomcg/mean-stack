import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authSub: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.authSub = this.auth.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
  
  onLogin(loginForm: NgForm) {
    if(loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.login(loginForm.value.email, loginForm.value.password)
  }
}
