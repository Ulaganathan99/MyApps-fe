import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userDetails: any;

  constructor(private router: Router, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    if(localStorage.getItem(Constants.APP.SESSION_USER_DATA)){
      this.userDetails = JSON.parse(localStorage.getItem(Constants.APP.SESSION_USER_DATA) || "{}");
    } else {
      this.router.navigate(['/login']);
    }
    this.localStorageService.removeItem(Constants.APP.SELECTED_SIDENAV)
    this.localStorageService.setItem(Constants.APP.SELECTED_TOPNAV,'Home')

  }

}
