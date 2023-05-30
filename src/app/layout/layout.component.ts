import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Constants } from '../Constants/constants';
import { UserService } from '../services/user.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  is_loggedIn: any = false;
  selected_top_menu: any;
  show_dropdown_menu: boolean = false;

  topmenu_list: any = [
    { name: 'Home', route: '/index/home/', permission: true },
    { name: 'Profile', route: 'index/profile/', permission: true },
    { name: 'Login', route: '/login/', permission: false },
    { name: 'Register', route: '/signup/', permission: false },
  ];
  

  constructor(private router: Router, private localStorageService: LocalStorageService) {
   
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (localStorage.getItem(Constants.APP.SESSION_ID)) {
          this.is_loggedIn = true;
        }
        if (!localStorage.getItem(Constants.APP.SESSION_ID)) {
          this.is_loggedIn = false;
        }
      }
    });
    // this.selected_top_menu = localStorage.getItem(Constants.APP.SELECTED_TOPNAV)
  }

  ngOnInit(): void {
    if (localStorage.getItem(Constants.APP.SESSION_ID)) {
      this.is_loggedIn = true;
    }
    if (!localStorage.getItem(Constants.APP.SELECTED_TOPNAV)) {
      this.localStorageService.setItem(
        Constants.APP.SELECTED_TOPNAV,
        'Login'
      );
    } 
    if (localStorage.getItem(Constants.APP.SELECTED_TOPNAV)) {
     this.selected_top_menu = this.localStorageService.getItem(Constants.APP.SELECTED_TOPNAV);
    }
    // Subscribe to changes in the selected_top_nav value
    this.localStorageService.onChange.subscribe((key: string) => {
      if (key === Constants.APP.SELECTED_TOPNAV) {
        this.selected_top_menu = this.localStorageService.getItem(Constants.APP.SELECTED_TOPNAV);
      } 
    });

    
    
  }
  ham_menu() {}
  logout(): void {
    localStorage.clear();
    this.localStorageService.setItem(Constants.APP.SELECTED_TOPNAV,'Login');
    this.router.navigate(['/login']);
  }

  changeMenu(data: any) {
    this.selected_top_menu = data.name;
    this.localStorageService.removeItem(Constants.APP.SELECTED_SIDENAV);

    this.localStorageService.setItem(
      Constants.APP.SELECTED_TOPNAV,
      this.selected_top_menu
    );
    localStorage.removeItem(Constants.APP.SELECTED_TAB);
  }
}
