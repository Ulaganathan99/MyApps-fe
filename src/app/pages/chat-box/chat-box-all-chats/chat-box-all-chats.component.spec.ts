import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxAllChatsComponent } from './chat-box-all-chats.component';

describe('ChatBoxAllChatsComponent', () => {
  let component: ChatBoxAllChatsComponent;
  let fixture: ComponentFixture<ChatBoxAllChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxAllChatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxAllChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
