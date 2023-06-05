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
  // avatarData: string | ArrayBuffer | null = null;
  avatarData: string | ArrayBuffer | null = null;

  constructor(
    private userService: UserService,
    private loaderService: LoaderService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private localStorageService: LocalStorageService
  ) {}
  
  ngOnInit(): void {
    if (localStorage.getItem(Constants.APP.SESSION_USER_DATA)) {
      this.userDetails = JSON.parse(
        localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
      );
      this.fetchUserInfo(this.userDetails.user_id);
    }
    this.localStorageService.removeItem(Constants.APP.SELECTED_SIDENAV)
    this.localStorageService.setItem(Constants.APP.SELECTED_TOPNAV,'Profile')

    
    
  }
 
  fetchUserInfo(user_id: any) {
    this.loaderService.show();
    this.userService.fetchUserInfo(user_id).subscribe({
      next: (res) => {
        if(res.statusCode == 1){
          console.log('res');
          
          console.log(res);    
          this.user_info = res.data;
          console.log(this.user_info);
          this.createImageFromBlob(res.data.avatar);
          this.loaderService.hide();
        }
        
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });
  }

  get sanitizedAvatarData(): SafeUrl | null {
    return this.avatarData ? this.sanitizer.bypassSecurityTrustUrl(this.avatarData.toString()) : null;
  }

   createImageFromBlob(image: any): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.avatarData = reader.result;
    };
    const blob = new Blob([new Uint8Array(image.data)], { type: image.contentType });
    reader.readAsDataURL(blob);
  }

  clickEdit(){
    this.router.navigate(['/index/profile-edit'], { state: { user: this.user_info } });
  }
}
