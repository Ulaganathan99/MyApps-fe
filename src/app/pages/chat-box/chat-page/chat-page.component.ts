import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
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
  message!: string;
  message_list: any = [ ]
  feedback!: string;

  constructor(private router: Router, private chatService : ChatService, private webSocketService : WebSocketService) { }

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
    this.webSocketService.listen('typing').subscribe((data) => this.updateFeedback(data))
    this.webSocketService.listen('chat').subscribe((data) => this.updateMessage(data))
  }

  updateFeedback(data: any){
    this.feedback = ''
    if(!!!data) return;
  }
  updateMessage(data: any){
    this.feedback = `${data} is typing a message`
    if(!!!data) return;
    this.message_list.push(data)
  }
  messageTyping() {
    console.log('is typing'); 
    this.webSocketService.emit('typing', this.userDetails.user_id)
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

        console.log(this.message_list);
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
          this.getMessages()
          console.log(res);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.webSocketService.emit('chat', {
      message: this.message,
      handle: this.userDetails.user_id
    })
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default behavior of creating a new line
      this.sendMsg(); // Call the send message function
    }
  }
  
  clickBack(){
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
