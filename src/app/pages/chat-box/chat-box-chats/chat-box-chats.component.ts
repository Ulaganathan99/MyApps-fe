import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { ContactService } from 'src/app/services/contact.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-chat-box-chats',
  templateUrl: './chat-box-chats.component.html',
  styleUrls: ['./chat-box-chats.component.scss']
})
export class ChatBoxChatsComponent implements OnInit {

  userDetails: any;
  chatContactList: any;

  constructor(private loaderService: LoaderService,
    private chatService: ChatService,
    private router: Router,) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.fetchContactInfo(this.userDetails.user_id);
  }
  fetchContactInfo(userID: string) {
    this.chatService.getChatContacts(userID).subscribe({
      next: (res) => {
        this.loaderService.show();
        this.chatContactList = res.chatContactList
        console.log(this.chatContactList);
        
        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });
   
  }
  clickChatBox(data: any){
    this.router.navigate(['/index/chat-box/chat-page'], { state: { contactDetails: data } });
  }

}
