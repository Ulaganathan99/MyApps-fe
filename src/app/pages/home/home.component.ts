import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userDetails: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem(Constants.APP.SESSION_USER_DATA)){
      this.userDetails = JSON.parse(localStorage.getItem(Constants.APP.SESSION_USER_DATA) || "{}");
    } else {
      this.router.navigate(['/login']);
    }

  }

}
