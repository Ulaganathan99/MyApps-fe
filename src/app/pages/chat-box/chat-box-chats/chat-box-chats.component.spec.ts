import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxChatsComponent } from './chat-box-chats.component';

describe('ChatBoxChatsComponent', () => {
  let component: ChatBoxChatsComponent;
  let fixture: ComponentFixture<ChatBoxChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxChatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
