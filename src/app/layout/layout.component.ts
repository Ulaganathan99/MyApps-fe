import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Constants } from '../Constants/constants';
import { UserService } from '../services/user.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { Utils } from 'src/app/common/utils';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  is_loggedIn: any = false;
  selected_top_menu: any;
  selected_dropdown_menu : any;
  show_dropdown_menu: boolean = false;
  private unsubscribe$ = new Subject<void>();


  topmenu_list: any = [
    { name: 'Home', route: '/index/home/', permission: true },
    { name: 'Profile', route: 'index/profile/', permission: true },
    { name: 'Login', route: '/login/', permission: false },
    { name: 'Register', route: '/signup/', permission: false },
  ];
  dropDownMenuList : any = [
    { name: 'Home', route: '/index/home/', permission: true },
    { name: 'Profile', route: 'index/profile/', permission: true },
    {name: 'Contact Book', route : '/index/contact-book', permission: true, sideMenu : true},
    {name: 'Chat Box', route : '/index/chat-box', permission: true, sideMenu : true},
    {name: 'Streaming', route : '/index/video-streaming', permission: true, sideMenu : true},
    {name: 'My Drive', route : '/index/drive', permission: true, sideMenu : true},
    { name: 'Login', route: '/login/', permission: false },
    { name: 'Register', route: '/signup/', permission: false },
  ]
  

  constructor(private router: Router, private localStorageService: LocalStorageService, private utilsClass: Utils) {
   
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
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
    if (!localStorage.getItem(Constants.APP.SELECTED_TOPNAV) && !this.is_loggedIn) {
      this.localStorageService.setItem(
        Constants.APP.SELECTED_TOPNAV,
        'Login'
      );
    } 
    if (localStorage.getItem(Constants.APP.SELECTED_TOPNAV)) {
     this.selected_dropdown_menu = this.localStorageService.getItem(Constants.APP.SELECTED_TOPNAV);
    } else if(localStorage.getItem(Constants.APP.SELECTED_SIDENAV)){
      this.selected_dropdown_menu = this.localStorageService.getItem(Constants.APP.SELECTED_SIDENAV);
    }
    // Subscribe to changes in the selected_top_nav value
    this.localStorageService.onChange.pipe(takeUntil(this.unsubscribe$)).subscribe((key: string) => {
      if (key === Constants.APP.SELECTED_TOPNAV) {
        this.selected_top_menu = this.localStorageService.getItem(Constants.APP.SELECTED_TOPNAV);
        this.selected_dropdown_menu = this.localStorageService.getItem(Constants.APP.SELECTED_TOPNAV);
      } 
    });
    this.localStorageService.onChange.pipe(takeUntil(this.unsubscribe$)).subscribe((key: string) => {
      if (key === Constants.APP.SELECTED_SIDENAV) {
        this.selected_dropdown_menu = this.localStorageService.getItem(Constants.APP.SELECTED_SIDENAV);
      } 
    });

    
    
  }
  ham_menu() {    
    this.show_dropdown_menu = !this.show_dropdown_menu;
  }
  logout(): void {
    localStorage.clear();
    this.utilsClass.openSuccessSnackBar('Logout Success');
    // this.socketService.disconnect(userNumber)
    this.localStorageService.setItem(Constants.APP.SELECTED_TOPNAV,'Login');
    this.router.navigate(['/login']);
  }

  changeMenu(data: any) {
    if(data.sideMenu){
      this.selected_dropdown_menu = data.name;
      this.localStorageService.removeItem(Constants.APP.SELECTED_TOPNAV);
      this.localStorageService.setItem(Constants.APP.SELECTED_SIDENAV,(data.name));
      localStorage.removeItem(Constants.APP.SELECTED_TAB);
      if(this.show_dropdown_menu){
        this.show_dropdown_menu = false;
      }
    }else{
      this.selected_top_menu = data.name;
      this.selected_dropdown_menu = data.name;
      this.localStorageService.removeItem(Constants.APP.SELECTED_SIDENAV);

      this.localStorageService.setItem(
        Constants.APP.SELECTED_TOPNAV,
        this.selected_top_menu
      );
      localStorage.removeItem(Constants.APP.SELECTED_TAB);
      if(this.show_dropdown_menu){
        this.show_dropdown_menu = false;
      }
    }
  }
  
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isClickedOnMenuIcon = clickedElement.closest('.ham-menu') !== null;
    const isClickedInsideMenu = clickedElement.closest('.menu_dropdown') !== null;

    if (!isClickedOnMenuIcon && !isClickedInsideMenu) {
      this.show_dropdown_menu = false;
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
