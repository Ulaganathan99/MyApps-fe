import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LoaderService } from 'src/app/services/loader.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  forgotForm: FormGroup;
  showErrors: boolean = false;

  msg: String = '';
  msg_status: String = '';

  constructor(private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,) { 
    
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    if(this.localStorageService.getItem(Constants.APP.SESSION_ID)){
      this.router.navigate(['/index'])
    }
  }
  toLogin() {
    this.router.navigate(['/login']);
    this.localStorageService.setItem(
      Constants.APP.SELECTED_TOPNAV,
      'Login'
    );
  }
  clickSubmit() {
    const email = this.forgotForm.value.email;
    this.showErrors = true;
    if (this.forgotForm.status === 'VALID') {
      this.loaderService.show();
      this.userService.forgot(email).subscribe({
        next: (res) => {
          if (res.statusCode == 1) {
            console.log(res);
            this.router.navigate(['/forgot-otp'], { state: { email: email } });
            this.loaderService.hide();
          } else {
            if (res.error) {
              (this.msg = res.error), (this.msg_status = 'error');
            }
            this.loaderService.hide();
          }
        },
        error: (err) => {
          console.log(err);
          this.loaderService.hide();
        },
      });
    } else {
      console.log('invalid');
    }
  }
}
