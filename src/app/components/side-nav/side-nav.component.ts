import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Output() menu_changed = new EventEmitter<any>();

  selected_side_nav : any;

  constructor(private localStorageService: LocalStorageService) { 
    // if(localStorage.getItem(Constants.APP.SELECTED_SIDENAV)){
    //   this.selected_tab = JSON.parse(localStorage.getItem(Constants.APP.SELECTED_SIDENAV) || "{}");
    // }
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constants.APP.SELECTED_SIDENAV)) {
      this.selected_side_nav = this.localStorageService.getItem(Constants.APP.SELECTED_SIDENAV);
     }
    this.localStorageService.onChange.subscribe((key: string) => {
      if (key === Constants.APP.SELECTED_SIDENAV) {
        this.selected_side_nav = this.localStorageService.getItem(Constants.APP.SELECTED_SIDENAV);
      } 
    });
  }

  menu_list: any[] = [
    {name: 'Contact Book', route : '/index/contact-book'},
    {name: 'Chat Box', route : '/index/chat-box'},
    // {name: 'My Jobs', icon: 'assets/img/find-jobs.svg', route : '/home/my-jobs'},
    // {name: 'Booking', icon: 'assets/img/booking.svg', route : '/home/customer-feedback'},
   
  ]

  clear(ev:any){
    this.selected_side_nav = ev.name;
    this.menu_changed.emit(ev.name);
    this.localStorageService.removeItem(Constants.APP.SELECTED_TOPNAV);
    this.localStorageService.setItem(Constants.APP.SELECTED_SIDENAV,(this.selected_side_nav));
    localStorage.removeItem(Constants.APP.SELECTED_TAB);
  }


}
