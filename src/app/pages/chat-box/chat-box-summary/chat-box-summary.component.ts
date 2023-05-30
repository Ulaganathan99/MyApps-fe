import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-box-summary',
  templateUrl: './chat-box-summary.component.html',
  styleUrls: ['./chat-box-summary.component.scss']
})
export class ChatBoxSummaryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  tabs_list: any = [
    { key: 'chats', label: 'Chats', route: 'index/chat-box/chat-box-chats' },
    { key: 'history', label: 'History', route: 'index/chat-box/chat-box-history' },
    { key: 'invite', label: 'Invite', route: 'index/chat-box/chat-box-invite' }
  ]

}
