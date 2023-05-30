import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { log } from 'console';
import { Constants } from 'src/app/Constants/constants';
import { LoaderService } from 'src/app/services/loader.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  showErrors: boolean = false;

  msg: String = ''
  msg_status: String = ''

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService
  ) {
    this.signupForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if(this.localStorageService.getItem(Constants.APP.SESSION_ID)){
      this.router.navigate(['/index'])
    }
  }
  clickSignUp() {
    const name = this.signupForm.value.name;
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    const confirmPassword = this.signupForm.value.confirmPassword;
    this.showErrors = true;

    if (this.signupForm.status === 'VALID' && password === confirmPassword) {
      this.userService.signup(name, email, password).subscribe({
        next: (res) => {
          
          if (res.statusCode === 1) {            
            this.router.navigate(['/signup-otp'], { state: { email: email } });
          }else {
            if(res.error){
              this.msg = res.error,
              this.msg_status = 'error'
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
  toLogin() {
    this.router.navigate(['/login']);
    this.localStorageService.setItem(
      Constants.APP.SELECTED_TOPNAV,
      'Login'
    );
  }
}
