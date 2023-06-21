import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/constants';
import { ContactService } from 'src/app/services/contact.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SearchService } from 'src/app/services/search.service';

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
  searchText: string = '';
  contactsLength: any;
  search_length: any;
  pageEventData = {
    pageIndex: 1,
    pageSize: 10
  }

  records_count = this.pageEventData.pageSize;


  constructor(
    private loaderService: LoaderService,
    private contactService: ContactService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.fetchContactInfo( this.pageEventData);
    this.searchService.setSearchText('');
  }

  fetchContactInfo(event:any) {
    this.loaderService.show();
    event = { ...this.pageEventData, searchText: this.searchText}
    if(event.searchText){
      this.loaderService.hide();
    }
    this.contactService.getContactsTable(this.userDetails.user_id, event).subscribe({
      next: (res) => {
        if(res.statusCode == 1){
          this.search_length = event.searchText.length;
          this.contactsLength = res.totalRecords;
          this.records_count = this.pageEventData.pageSize;
          this.contactList = res.contactList.map((contact: any) => {
            return { ...contact, checked: false };
          });
          this.loaderService.hide();
        }
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
      this.fetchContactInfo({});
    }
  }
  resetPage() {
    this.pageEventData = {
      pageIndex: 1,
      pageSize: 10
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
            this.fetchContactInfo({});
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
      
    } else {
      this.selectedContact = [];
    }

    for (let contact of this.contactList) {
      contact.checked = this.selectAll;
    }
  }
  onSearch(event: any) {
    this.resetPage()
    this.searchText = event.searchText;
    this.searchService.setSearchText(event.searchText);  
    this.fetchContactInfo({});
  
  }
  clickDownload(){
    this.contactService.downloadContacts(this.userDetails.user_id ).subscribe( 
      (response: any) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'contacts.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
        console.log(error);
      }
    )
    
  }
  onPaginate(event: any) {
    this.pageEventData = { pageIndex: event.pageIndex, pageSize: event.pageSize };
    this.fetchContactInfo({});
  }
  contactUpdated(){
    this.fetchContactInfo({});
  }

}
