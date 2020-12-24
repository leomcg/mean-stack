import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  onSignup(signupForm: NgForm) {
    if(signupForm.invalid) {
      return;
    }
    this.auth.createUser(signupForm.value.email, signupForm.value.name, signupForm.value.password)
  }
}
