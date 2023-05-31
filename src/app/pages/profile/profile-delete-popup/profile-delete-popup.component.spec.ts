import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDeletePopupComponent } from './profile-delete-popup.component';

describe('ProfileDeletePopupComponent', () => {
  let component: ProfileDeletePopupComponent;
  let fixture: ComponentFixture<ProfileDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileDeletePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
