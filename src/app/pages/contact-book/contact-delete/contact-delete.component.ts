import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact-delete',
  templateUrl: './contact-delete.component.html',
  styleUrls: ['./contact-delete.component.scss']
})
export class ContactDeleteComponent implements OnInit {

  @Output() closeDelete = new EventEmitter<string>();
  @Input() contactDetail: any;

  userDetails: any;
  
  constructor(private contactService: ContactService, private router: Router) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    
  }
  close(){
    this.closeDelete.emit("cancel");
  }
  clickDelete(number: string){
    this.contactService.deleteContact(this.userDetails.user_id, number).subscribe({
      next: (res) => {    
        if (res.statusCode == 1) {
          this.closeDelete.emit("delete");
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
