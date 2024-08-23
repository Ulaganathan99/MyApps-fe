import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'src/app/common/utils';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userDetails: any;

  studiesTabs: any = [
    { 'subject' : 'Angular'},
    { 'subject' : 'Bulma'},
    { 'subject' : 'ExpressJs'},
  ]

  constructor(private router: Router, private localStorageService: LocalStorageService, private userService: UserService, private utils: Utils) { }

  ngOnInit(): void {
    if(localStorage.getItem(Constants.APP.SESSION_USER_DATA)){
      this.userDetails = JSON.parse(localStorage.getItem(Constants.APP.SESSION_USER_DATA) || "{}");
    } else {
      this.router.navigate(['/login']);
    }
    this.localStorageService.removeItem(Constants.APP.SELECTED_SIDENAV)
    this.localStorageService.setItem(Constants.APP.SELECTED_TOPNAV,'Home')

  }
  clearSocketConnection(){
    this.userService.clearSocket(this.userDetails.user_id).subscribe({
      next:(res) => {
        if(res.statusCode == 1){
          this.utils.openSuccessSnackBar('Connection cleared')
        } else if(res.statusCode == 0){
          this.utils.openErrorSnackBar('Permission denied')
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
