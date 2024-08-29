import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFilePopupComponent } from './add-file-popup.component';

describe('AddFilePopupComponent', () => {
  let component: AddFilePopupComponent;
  let fixture: ComponentFixture<AddFilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
