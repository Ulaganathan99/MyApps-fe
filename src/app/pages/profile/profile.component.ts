import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LoaderService } from 'src/app/services/loader.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userDetails: any;
  user_info: any = [];
  profilePicture!: string;

  constructor(
    private userService: UserService,
    private loaderService: LoaderService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}
  
   ngOnInit(): void {
    if (localStorage.getItem(Constants.APP.SESSION_USER_DATA)) {
      this.userDetails = JSON.parse(
        localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
      );
    }
     this.fetchUserInfo(this.userDetails.user_id);
  }

  getProfileImg(url: any){
    if(url){
      this.userService.getProfile(url).subscribe((response) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.profilePicture = reader.result as string;
        };
        reader.readAsDataURL(response);
      });
    }
  }
 
   fetchUserInfo(user_id: any) {
    this.loaderService.show();
    this.userService.fetchUserInfo(user_id).subscribe({
      next: (res) => {
        if(res.statusCode == 1){  
          this.user_info = res.data;
          const updatedUser = {
            ...this.userDetails,
            user_logo: res.data.avatar
          };
          localStorage.setItem(
            Constants.APP.SESSION_USER_DATA,
            JSON.stringify(updatedUser)
          );
          if(res.data.avatar){
            this.getProfileImg(res.data.avatar)
          }
          this.loaderService.hide();
        }    
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });
  }

  clickEdit(){
    this.router.navigate(['/index/profile-edit'], { state: { user: this.user_info } });
  }
}
