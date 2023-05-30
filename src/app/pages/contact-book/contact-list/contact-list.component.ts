import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/constants';
import { ContactService } from 'src/app/services/contact.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  userDetails: any;
  contactList: any;
  showDeleteModel: boolean = false;
  showEditModel: boolean = false;
  selectedContact: any = [];
  selected_action: any = 'Bulk Action';
  selectAll: boolean = false;
  action_list: any = ['Bulk Action', 'Delete All'];

  constructor(
    private loaderService: LoaderService,
    private contactService: ContactService
  ) {}

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
        this.contactList = res.contactList.map((contact: any) => {
          return { ...contact, checked: false };
        });

        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });
  }
  clickDelete(data: any) {
    this.showDeleteModel = true;
    this.selectedContact = data;
  }
  closeDelete(event: string) {
    if (event === 'cancel') {
      this.showDeleteModel = false;
    } else if (event === 'delete') {
      this.showDeleteModel = false;
      this.fetchContactInfo(this.userDetails.user_id);
    }
  }

  clickEdit(data: any) {
    this.showEditModel = true;
    this.selectedContact = data;
  }
  closeEdit(event: any) {
    this.showEditModel = event;
  }
  actionChanged(event: any) {
    if(event === 'Delete All'){
      this.contactService.deleteAllContacts(this.userDetails.user_id, this.selectedContact ).subscribe({
        next: (res) => {    
          if (res.statusCode == 1) {
            this.fetchContactInfo(this.userDetails.user_id);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
    
  }
  checkedAction(data: any) {
    console.log(data);
  if (data.checked) {
    this.selectedContact.push(data);
    console.log(this.selectedContact);
  } else {
    this.selectedContact = this.selectedContact.filter((contact: any) => contact.number !== data.number);
    console.log(this.selectedContact);
  }
    
  }

  selectAllContacts() {
    this.selectAll = !this.selectAll;

    if (this.selectAll) {
      this.selectedContact = [...this.contactList];
      console.log(this.selectedContact);
      
    } else {
      this.selectedContact = [];
      console.log(this.selectedContact);
    }

    for (let contact of this.contactList) {
      contact.checked = this.selectAll;
    }
  }

}
