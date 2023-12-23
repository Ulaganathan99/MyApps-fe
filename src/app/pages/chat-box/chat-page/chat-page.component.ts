import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { Utils } from 'src/app/common/utils';
import { ChatService } from 'src/app/services/chat.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  contactDetails: any;
  userDetails: any;
  user_info!: any;
  message!: string;
  message_list: any = [];
  feedback!: string;
  typingTimeout: any;
  onlineStatus!: string;
  profileImage!: string;


  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private chatService: ChatService,
    private webSocketService: WebSocketService,
    private userService: UserService,
    private utilsClass: Utils
  ) {}

  ngOnInit(): void {
    if (history.state.contactDetails != undefined) {
      this.contactDetails = history.state.contactDetails;
    } else {
      this.router.navigate(['/index/chat-box/chat-box-chats']);
    }
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.getProfileImg(this.contactDetails?.avatar)

    this.fetchChatInfo(this.userDetails.user_id);
    this.setupSocketListeners();
  }

  fetchChatInfo(user_id: any) {
    this.loaderService.show();
    this.userService.fetchUserInfo(user_id).subscribe({
      next: (res) => {
        this.user_info = res.data;        
        this.getMessages();
        this.webSocketService.emit('updatedOnlineStatus', {
          handle: this.userDetails.user_id,
        });
        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });
  }
  getProfileImg(url: any){
    this.userService.getProfile(url).subscribe((response) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(response);
    });
  }
  setupSocketListeners() {
    this.webSocketService
      .listen('typing')
      .subscribe((data) => this.updateFeedback(data));
    this.webSocketService
      .listen('chat')
      .subscribe((data) => this.updateMessage(data));
    this.webSocketService
      .listen('updatedOnlineStatus')
      .subscribe((data) => this.updateOnlineStatus(data));
  }

  updateOnlineStatus(data: any) {
    const userNumber = this.contactDetails ? this.contactDetails.number : null;
    if (userNumber && data[userNumber]) {
      this.onlineStatus = data[userNumber].online;
    }
  }

  updateFeedback(data: any) {
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
  updateMessage(data: any) {
    this.feedback = '';
    if (!!!data) return;
    if (data.handle === this.userDetails.user_id) {
      data = { ...data, msgStatus: 'send' };
    } else {
      data = { ...data, msgStatus: 'receive' };
    }
    this.message_list.push(data);

    this.scrollToBottom();
  }
  messageTyping() {
    this.webSocketService.emit('typing', { handle: this.userDetails.user_id });
  }

  getMessages() {
    this.chatService
      .getChatMsg(this.userDetails.user_id, this.contactDetails.number)
      .subscribe({
        next: (res) => {
          const sendMessages = res.sendMessages.map((msg: any) => ({
            ...msg,
            msgStatus: 'send',
          }));
          const receiveMessages = res.receiveMessages.map((msg: any) => ({
            ...msg,
            msgStatus: 'receive',
          }));

          this.message_list = [...sendMessages, ...receiveMessages].sort(
            (a, b) => {
              const timestampA = new Date(a.timestamp);
              const timestampB = new Date(b.timestamp);
              return timestampA.getTime() - timestampB.getTime();
            }
          );

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

  sendMsg() {
    this.chatService
      .sendChatMsg(
        this.message,
        this.userDetails.user_id,
        this.contactDetails.number
      )
      .subscribe({
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
    });
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default behavior of creating a new line
      this.sendMsg(); // Call the send message function
    }
  }

  clickBack() {
    this.router.navigate(['/index/chat-box/chat-box-chats']);
  }
  clickOptions(){
    
  }
  clearChat() {
    this.chatService
      .deleteChatHistory(this.userDetails.user_id, this.contactDetails.number)
      .subscribe({
        next: (res) => {
          if (res.statusCode == 1) {
            this.router.navigate(['/index/chat-box']);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  clickVideo(){
    if(this.onlineStatus !== 'offline'){
      this.router.navigate(['/index/chat-box/video-chat'], { state: { contactDetails: {
        number: this.contactDetails.number,
        name: this.contactDetails.name,
        avatar: this.contactDetails.avatar
      } } })
      this.webSocketService.emit('video-chat-request', {
        contactDetails: {number: this.userDetails.user_number, name: this.userDetails.user_name, avatar: this.userDetails.user_logo},
        userDetails: this.contactDetails
      });
    }else{
      this.utilsClass.openErrorSnackBar(`${this.contactDetails.name} is offline`);
    }
    
  }
}
