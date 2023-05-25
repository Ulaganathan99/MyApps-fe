import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showErrors: boolean = false;

  msg: String = '';
  msg_status: String = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}
  toRegister() {
    this.router.navigate(['/signup']);
    this.localStorageService.setItem(
      Constants.APP.SELECTED_TOPNAV,
      'Register'
    );
  }
  clickLogin() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.showErrors = true;

    if (this.loginForm.status === 'VALID') {
      this.userService.login(email, password).subscribe({
        next: (res) => {
          if (res.statusCode == 1) {
            console.log(res);
            localStorage.setItem(
              Constants.APP.SESSION_USER_DATA,
              JSON.stringify(res.user)
            );
            localStorage.setItem(Constants.APP.SESSION_ID, res.session_id);
            localStorage.removeItem(Constants.APP.SELECTED_SIDENAV);
            this.router.navigate(['/index'], {
              state: { user: res.user },
            });
            this.localStorageService.setItem(Constants.APP.SELECTED_TOPNAV, 'Home');
          } else {
            if (res.error) {
              (this.msg = res.error), (this.msg_status = 'error');
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      console.log('invalid');
    }
  }
}
