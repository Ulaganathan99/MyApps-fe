import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupOtpVerificationComponent } from './signup-otp-verification.component';

describe('SignupOtpVerificationComponent', () => {
  let component: SignupOtpVerificationComponent;
  let fixture: ComponentFixture<SignupOtpVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupOtpVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupOtpVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
