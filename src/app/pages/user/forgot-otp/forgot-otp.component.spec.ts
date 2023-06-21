import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotOtpComponent } from './forgot-otp.component';

describe('ForgotOtpComponent', () => {
  let component: ForgotOtpComponent;
  let fixture: ComponentFixture<ForgotOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
