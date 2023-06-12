import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-chat-box-invite',
  templateUrl: './chat-box-invite.component.html',
  styleUrls: ['./chat-box-invite.component.scss']
})
export class ChatBoxInviteComponent implements OnInit {

  userDetails: any;
  inviteContactList: any;
  searchInviteContactList: any;
  searchText: any;


  constructor(private loaderService: LoaderService,
    private chatService: ChatService,
    private router: Router,
    private searchService: SearchService) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.fetchContactInfo(this.userDetails.user_id);
    this.searchService.setSearchText('');
    this.searchService.searchText$.subscribe(searchText => {
      this.searchText = searchText;
      this.searchContact()
    });
  }
  fetchContactInfo(userID: string) {
    this.loaderService.show();
    this.chatService.getInviteContacts(userID).subscribe({
      next: (res) => {
        this.inviteContactList = res.inviteContactList
        this.inviteContactList.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });
   
  }
  clickChatBox(data: any){
    // this.router.navigate(['/index/chat-box/chat-page'], { state: { contactDetails: data } });
  }
  searchContact(){
    if (this.searchText) {
      const searchRegex = new RegExp(this.searchText, 'i');
      this.searchInviteContactList = this.inviteContactList.filter(
        (contact: { name: string; number: string; }) =>
          contact.name.match(searchRegex) ||
          contact.number.match(searchRegex)
      );
    }     
  }

}
