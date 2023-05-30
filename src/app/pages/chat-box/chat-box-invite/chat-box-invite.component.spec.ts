import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxInviteComponent } from './chat-box-invite.component';

describe('ChatBoxInviteComponent', () => {
  let component: ChatBoxInviteComponent;
  let fixture: ComponentFixture<ChatBoxInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
