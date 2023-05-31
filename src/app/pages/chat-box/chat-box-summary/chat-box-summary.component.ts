import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-box-summary',
  templateUrl: './chat-box-summary.component.html',
  styleUrls: ['./chat-box-summary.component.scss']
})
export class ChatBoxSummaryComponent implements OnInit {

  selected_tab:string = 'chats';

  constructor() { }

  ngOnInit(): void {
  }

  tabs_list: any = [
    { key: 'chats', label: 'Chats', route: 'chat-box-chats' },
    { key: 'history', label: 'History', route: 'chat-box-history' },
    { key: 'invite', label: 'Invite', route: 'chat-box-invite' }
  ]

  tabChange(data:any){
    console.log(data);
    
    this.selected_tab = data

  }

}
