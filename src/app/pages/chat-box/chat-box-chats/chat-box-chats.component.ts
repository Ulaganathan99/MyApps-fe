import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { ContactService } from 'src/app/services/contact.service';
import { LoaderService } from 'src/app/services/loader.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-chat-box-chats',
  templateUrl: './chat-box-chats.component.html',
  styleUrls: ['./chat-box-chats.component.scss']
})
export class ChatBoxChatsComponent implements OnInit {

  userDetails: any;
  chatContactList: any;
  onlineStatusInfo: { [key: string]: any } = {};

  constructor(private loaderService: LoaderService,
    private chatService: ChatService,
    private router: Router,
    private webSocketService : WebSocketService,) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.fetchContactInfo(this.userDetails.user_id);
    this.setupSocketListeners();
  }
  fetchContactInfo(userID: string) {
    this.loaderService.show();
    this.chatService.getChatContacts(userID).subscribe({
      next: (res) => {
        this.chatContactList = res.chatContactList;
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

  setupSocketListeners() {
    this.webSocketService
      .listen('updatedOnlineStatus')
      .subscribe((data) => this.updateOnlineStatus(data));
  }

  updateOnlineStatus(data: any) {
    this.onlineStatusInfo = data
  }

  clickChatBox(data: any){
    this.router.navigate(['/index/chat-box/chat-page'], { state: { contactDetails: data } });
  }

}
