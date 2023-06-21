import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LoaderService } from 'src/app/services/loader.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {
  forgotForm: FormGroup;
  showErrors: boolean = false;

  msg: String = '';
  msg_status: String = '';
  user_email!: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
  ) {
    this.forgotForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.localStorageService.getItem(Constants.APP.SESSION_ID)){
      this.router.navigate(['/index'])
    }
    if (history.state != undefined) {
      this.user_email = history.state.email;
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
    const newPassword = this.forgotForm.value.newPassword;
    const confirmPassword = this.forgotForm.value.confirmPassword;
    this.showErrors = true;
    if (this.forgotForm.status === 'VALID' && newPassword === confirmPassword) {
      this.loaderService.show();
      this.userService.changePassword(this.user_email, newPassword).subscribe({
        next: (res) => {
          if (res.statusCode == 1) {
            this.router.navigate(['/login']);
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
