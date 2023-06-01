import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  
  contactDetails: any;
  userDetails: any;
  message!: string;
  message_list: any = [ ]

  constructor(private router: Router, private chatService : ChatService) { }

  ngOnInit(): void {
    if (history.state.contactDetails != undefined) {
      this.contactDetails = history.state.contactDetails

    } else {
      this.router.navigate(['/index/chat-box/chat-box-chats']);     
    }
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.getMessages();
  }

  getMessages(){
    this.chatService.getChatMsg(this.userDetails.user_id, this.contactDetails.number).subscribe({
      next: (res) => {    
        if (res.statusCode == 1) {
          this.message_list = res.messages
          console.log(this.message_list);
          
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sendMsg(){
    this.chatService.sendChatMsg(this.message,this.userDetails.user_id, this.contactDetails.number).subscribe({
      next: (res) => {    
        if (res.statusCode == 1) {
          this.message = '';
          // this.getMessages()
          console.log(res);
          
        }
        if (res.statusCode == 2) {
          this.message = '';
          // this.getMessages()
          console.log(res);
          
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  
  clickBack(){
    this.router.navigate(['/index/chat-box/chat-box-chats']); 
  }
  

}
