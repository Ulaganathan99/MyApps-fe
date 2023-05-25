import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddContactComponent } from './contact-add-contact.component';

describe('ContactAddContactComponent', () => {
  let component: ContactAddContactComponent;
  let fixture: ComponentFixture<ContactAddContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAddContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAddContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
