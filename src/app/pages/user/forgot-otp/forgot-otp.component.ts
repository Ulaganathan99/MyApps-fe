import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-otp',
  templateUrl: './forgot-otp.component.html',
  styleUrls: ['./forgot-otp.component.scss']
})
export class ForgotOtpComponent implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpForm!: FormGroup;
  showErrors: boolean = false;
  otpDigits: number[] = [1, 2, 3, 4, 5, 6];
  currentDigitIndex = 0;
  user_email!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {
    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required],
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
  onInput(event: any, index: number): void {
    const target = event.target as HTMLInputElement;
    if (target.value.length === 1 && index < this.otpDigits.length - 1) {
      this.currentDigitIndex = index + 1;
      this.focusNextInput();
    } else if (target.value.length === 0 && index > 0) {
      this.currentDigitIndex = index - 1;
      this.focusPreviousInput();
    } else if (target.value.length === 0 && index === 0) {
      this.currentDigitIndex = 0;
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && index > 0 && target.value.length === 0) {
      event.preventDefault(); // Prevent default backspace behavior
      this.currentDigitIndex = index - 1;
      this.focusPreviousInput();
    } else if (
      event.key === 'ArrowRight' &&
      index < this.otpDigits.length - 1
    ) {
      event.preventDefault(); // Prevent default right arrow behavior
      this.currentDigitIndex = index + 1;
      this.focusNextInput();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault(); // Prevent default left arrow behavior
      this.currentDigitIndex = index - 1;
      this.focusPreviousInput();
    }
  }
  focusNextInput(): void {
    const nextInput = this.otpInputs.toArray()[this.currentDigitIndex];
    nextInput.nativeElement.focus();
  }

  focusPreviousInput(): void {
    const previousInput = this.otpInputs.toArray()[this.currentDigitIndex];
    previousInput.nativeElement.focus();
  }
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain');
    if (pastedText) {
      const otpArray = pastedText.split('').slice(0, this.otpDigits.length);
      otpArray.forEach((digit, index) => {
        const input = this.otpInputs.toArray()[index].nativeElement;
        input.value = digit;
        input.dispatchEvent(new Event('input'));
      });
    }
  }

  toRegister() {
    this.router.navigate(['/signup']);
    this.localStorageService.setItem(
      Constants.APP.SELECTED_TOPNAV,
      'Register'
    );
  }
  clickVerify() {
    this.showErrors = true;
    const otpValue = this.otpInputs
      .map((input) => input.nativeElement.value)
      .join('');
    if (this.otpForm.status === 'VALID') {
      this.userService.forgot_verification(this.user_email, otpValue).subscribe({
        next: (res) => {
          if (res.statusCode == 1) {
            this.router.navigate(['/forgot-pass'], { state: { email: this.user_email } });
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
