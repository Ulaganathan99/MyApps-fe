import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxVideoChatComponent } from './chat-box-video-chat.component';

describe('ChatBoxVideoChatComponent', () => {
  let component: ChatBoxVideoChatComponent;
  let fixture: ComponentFixture<ChatBoxVideoChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxVideoChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxVideoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
