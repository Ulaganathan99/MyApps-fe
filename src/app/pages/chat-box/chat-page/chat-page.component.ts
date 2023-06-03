import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  
  contactDetails: any;
  userDetails: any;
  user_info!: any;
  message!: string;
  message_list: any = [ ]
  feedback!: string;
  typingTimeout: any; 
  onlineStatus!: string;


  constructor(private router: Router, private chatService : ChatService, private webSocketService : WebSocketService, private userService: UserService,) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.disconnectAndSetOffline();
      }
    });

   }

  ngOnInit(): void {
    if (history.state.contactDetails != undefined) {
      this.contactDetails = history.state.contactDetails

    } else {
      this.router.navigate(['/index/chat-box/chat-box-chats']);     
    }
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
   
    this.fetchUserInfo(this.userDetails.user_id)
  }
 
  disconnectAndSetOffline() {
    this.webSocketService.disconnect(this.user_info.number);
    this.webSocketService.emit('updatedOnlineStatus', { handle: this.userDetails.user_id });
  }
  
  fetchUserInfo(user_id: any) {
  this.userService.fetchUserInfo(user_id).subscribe({
    next: (res) => {
      this.user_info = res.data;
      console.log('fetch');
      console.log(this.user_info.number);

      this.getMessages();
      this.webSocketService.connect(this.user_info.number);
      this.webSocketService.emit('updatedOnlineStatus', { handle: this.userDetails.user_id });
      this.webSocketService.listen('typing').subscribe((data) => this.updateFeedback(data));
      this.webSocketService.listen('chat').subscribe((data) => this.updateMessage(data));
      this.webSocketService.listen('updatedOnlineStatus').subscribe((data) => this.updateOnlineStatus(data));
    },
    error: (err) => {
      console.log(err);
    },
  });
}
 
  updateOnlineStatus(data: any) {
    console.log(data);
    const userNumber = this.contactDetails.number; 
    if (userNumber && data[userNumber]) {
      this.onlineStatus = data[userNumber].online;
      console.log(this.onlineStatus);
    }
  }

  updateFeedback(data: any){
    clearTimeout(this.typingTimeout); // Clear any existing typing timeout

    if (!!data && data.handle !== this.userDetails.user_id) {
      this.feedback = 'Typing...';
      // Set a timeout to clear the typing status after 2 seconds (adjust the delay as needed)
      this.typingTimeout = setTimeout(() => {
        this.feedback = '';
      }, 1000);
    } else {
      this.feedback = '';
    }
  }
  updateMessage(data: any){
    this.feedback = ''
    if(!!!data) return;
    if(data.handle === this.userDetails.user_id) {
      data = {...data, msgStatus: 'send'}
    } else {
      data = {...data, msgStatus: 'receive'}
    }
    this.message_list.push(data)
    
    this.scrollToBottom();
  }
  messageTyping() {
    this.webSocketService.emit('typing', {handle: this.userDetails.user_id})
  }

  getMessages(){
    this.chatService.getChatMsg(this.userDetails.user_id, this.contactDetails.number).subscribe({
      next: (res) => {    
        const sendMessages = res.sendMessages.map((msg: any) => ({ ...msg, msgStatus: 'send' }));
        const receiveMessages = res.receiveMessages.map((msg: any) => ({ ...msg, msgStatus: 'receive' }));

        this.message_list = [...sendMessages, ...receiveMessages].sort((a, b) => {
          const timestampA = new Date(a.timestamp);
          const timestampB = new Date(b.timestamp);
          return timestampA.getTime() - timestampB.getTime();
        });

        this.scrollToBottom();

      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer && this.chatContainer.nativeElement) {
        const container = this.chatContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    });
  }
 
  sendMsg(){
    this.chatService.sendChatMsg(this.message,this.userDetails.user_id, this.contactDetails.number).subscribe({
      next: (res) => {    
        if (res.statusCode == 1) {
          this.message = '';
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.webSocketService.emit('chat', {
      message: this.message,
      handle: this.userDetails.user_id,
      timestamp: Date(),
    })
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default behavior of creating a new line
      this.sendMsg(); // Call the send message function
    }
  }
  
  clickBack(){
    this.webSocketService.disconnect(this.user_info.number);
     this.webSocketService.emit('updatedOnlineStatus', { handle: this.userDetails.user_id });
    this.router.navigate(['/index/chat-box/chat-box-chats']); 
  }
  deleteChat(){
    this.chatService.deleteChatHistory(this.userDetails.user_id, this.contactDetails.number).subscribe({
      next: (res) => {    
        if (res.statusCode == 1) {
          
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

  }
  

}
