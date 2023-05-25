import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactBookSummaryComponent } from './contact-book-summary.component';

describe('ContactBookSummaryComponent', () => {
  let component: ContactBookSummaryComponent;
  let fixture: ComponentFixture<ContactBookSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactBookSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactBookSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
