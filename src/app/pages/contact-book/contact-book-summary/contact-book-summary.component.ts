import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-contact-book-summary',
  templateUrl: './contact-book-summary.component.html',
  styleUrls: ['./contact-book-summary.component.scss']
})
export class ContactBookSummaryComponent implements OnInit {

  userDetails: any;
  currentRoute!: string | null;
 

  constructor( private router: Router,private localStorageService: LocalStorageService) {
    this.currentRoute = null;
   }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.localStorageService.removeItem(Constants.APP.SELECTED_TOPNAV)
    this.localStorageService.setItem(Constants.APP.SELECTED_SIDENAV,'Contact Book')

    if(this.localStorageService.getItem('currentRoute')){
      this.currentRoute = this.localStorageService.getItem('currentRoute')
    }
    this.router.events.subscribe((event:any) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        localStorage.setItem('currentRoute', this.currentRoute); 
      }
    });
  }

  addContact(){
    this.router.navigate(['/index/contact-book/add-contact'], { state: { user: this.userDetails } });

  }

}
