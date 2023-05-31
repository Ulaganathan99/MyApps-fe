import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-delete-popup',
  templateUrl: './profile-delete-popup.component.html',
  styleUrls: ['./profile-delete-popup.component.scss']
})
export class ProfileDeletePopupComponent implements OnInit {

  @Input() userDetails: any;
  @Output() closeDelete = new EventEmitter<string>();

  constructor(private userService: UserService,private router: Router, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    
  }

  close(){
    this.closeDelete.emit("cancel");
  }
  clickDelete(userID : string){
    this.userService.deleteUser(userID).subscribe({
      next: (res) => {    
        if (res.statusCode == 1) {
          localStorage.clear();
          this.localStorageService.setItem(Constants.APP.SELECTED_TOPNAV,'Login');
          this.router.navigate(['/login']);
          this.closeDelete.emit("delete");
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
