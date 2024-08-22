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
    {name: 'Video Streaming', route : '/index/video-streaming'},
  ]

  clear(ev:any){
    this.selected_side_nav = ev.name;
    this.menu_changed.emit(ev.name);
    this.localStorageService.removeItem(Constants.APP.SELECTED_TOPNAV);
    this.localStorageService.setItem(Constants.APP.SELECTED_SIDENAV,(this.selected_side_nav));
    localStorage.removeItem(Constants.APP.SELECTED_TAB);
  }


}
