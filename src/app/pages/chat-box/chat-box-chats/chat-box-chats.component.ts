import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ContactService } from 'src/app/services/contact.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-chat-box-chats',
  templateUrl: './chat-box-chats.component.html',
  styleUrls: ['./chat-box-chats.component.scss']
})
export class ChatBoxChatsComponent implements OnInit {

  userDetails: any;
  contactList: any;

  constructor(private loaderService: LoaderService,
    private contactService: ContactService,
    private router: Router,) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.fetchContactInfo(this.userDetails.user_id);
  }
  fetchContactInfo(userID: string) {
    this.contactService.getContacts(userID).subscribe({
      next: (res) => {
        this.loaderService.show();
        this.contactList = res.contactList
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
