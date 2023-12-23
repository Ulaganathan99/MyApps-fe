import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { ContactService } from 'src/app/services/contact.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-chat-box-chats',
  templateUrl: './chat-box-chats.component.html',
  styleUrls: ['./chat-box-chats.component.scss']
})
export class ChatBoxChatsComponent implements OnInit {
  userDetails: any;
  chatContactList: any;
  searchChatContactList: any;
  onlineStatusInfo: { [key: string]: any } = {};
  searchText: any;
  profilePictures: { [key: string]: string } = {};

  constructor(private loaderService: LoaderService,
    private chatService: ChatService,
    private router: Router,
    private userService: UserService,
    private webSocketService : WebSocketService,
    private searchService: SearchService) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.fetchContactInfo(this.userDetails.user_id);
    this.setupSocketListeners();
    this.searchService.searchText$.subscribe(searchText => {
      this.searchText = searchText;
      this.searchContact()
    });
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
        this.fetchProfileImages()
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });
  }
  fetchProfileImages(): void {
    this.chatContactList.forEach((item: { avatar: any; number: string | number; }) => {      
      if(item.avatar){
        this.userService.getProfile(item.avatar).subscribe((response) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.profilePictures[item.number] = reader.result as string;
          };
          reader.readAsDataURL(response);
        });        
      } 
    });    
  }
  searchContact(){
    if (this.searchText) {
      const searchRegex = new RegExp(this.searchText, 'i');
      this.searchChatContactList = this.chatContactList.filter(
        (contact: { name: string; number: string; }) =>
          contact.name.match(searchRegex) ||
          contact.number.match(searchRegex)
      );
    }     
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
