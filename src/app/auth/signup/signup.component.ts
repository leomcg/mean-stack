import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignup(signupForm: NgForm) {
    if(signupForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.createUser(signupForm.value.email, signupForm.value.name, signupForm.value.password);
  }
}
