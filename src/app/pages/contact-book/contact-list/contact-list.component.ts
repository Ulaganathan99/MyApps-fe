import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/constants';
import { ContactService } from 'src/app/services/contact.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  userDetails: any;
  contactList: any;

  constructor(
    private loaderService: LoaderService,
    private contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.fetchContactInfo(this.userDetails.user_id)
  }

  fetchContactInfo(userID: string){
    this.contactService.getContacts(userID).subscribe({
      next: (res) => {
        console.log(res);
        this.contactList = res.contactList

        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });

  }

}
