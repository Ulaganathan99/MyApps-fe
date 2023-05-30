import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxSummaryComponent } from './chat-box-summary.component';

describe('ChatBoxSummaryComponent', () => {
  let component: ChatBoxSummaryComponent;
  let fixture: ComponentFixture<ChatBoxSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
