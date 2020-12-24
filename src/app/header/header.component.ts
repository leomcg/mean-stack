import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  public isAuthenticated = false;
  userName: string;
  userNameSub: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.userName = this.auth.getUserName();
    this.userNameSub = this.auth.getUserNameSubject().subscribe((userName: string) => {
      this.userName = userName;
    })
    this.isAuthenticated = this.auth.getIsAuth();
    this.authSub = this.auth.getAuthStatusListener().subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
    })
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  onLogout() {
    this.auth.logout();
  }

}
