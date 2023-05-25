import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';

@Component({
  selector: 'app-contact-book-summary',
  templateUrl: './contact-book-summary.component.html',
  styleUrls: ['./contact-book-summary.component.scss']
})
export class ContactBookSummaryComponent implements OnInit {

  userDetails: any;
 

  constructor( private router: Router,) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
  }

  addContact(){
    this.router.navigate(['/index/contact-book/add-contact'], { state: { user: this.userDetails } });

  }

}
