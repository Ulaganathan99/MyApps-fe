import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxHistoryComponent } from './chat-box-history.component';

describe('ChatBoxHistoryComponent', () => {
  let component: ChatBoxHistoryComponent;
  let fixture: ComponentFixture<ChatBoxHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
