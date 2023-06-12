import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SearchService } from 'src/app/services/search.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-chat-box-all-chats',
  templateUrl: './chat-box-all-chats.component.html',
  styleUrls: ['./chat-box-all-chats.component.scss']
})
export class ChatBoxAllChatsComponent implements OnInit {

  userDetails: any;
  chatContactList: any;
  searchChatContactList: any;
  onlineStatusInfo: { [key: string]: any } = {};
  searchText: any;

  constructor(private loaderService: LoaderService,
    private chatService: ChatService,
    private router: Router,
    private webSocketService : WebSocketService,
    private searchService: SearchService) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.fetchContactInfo(this.userDetails.user_id);
    this.setupSocketListeners();
    this.searchService.setSearchText('');
    this.searchService.searchText$.subscribe(searchText => {
      this.searchText = searchText;
      this.searchContact()
    });
  }
  fetchContactInfo(userID: string) {
    this.loaderService.show();
    this.chatService.getAllChatContacts(userID).subscribe({
      next: (res) => {        
        this.chatContactList = res.chatContactList;
        this.chatContactList.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
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
