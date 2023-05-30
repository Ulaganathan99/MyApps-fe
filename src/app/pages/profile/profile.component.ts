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
  imageData!: SafeUrl;

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
        console.log(res);
        
        this.user_info = res.data;
        console.log(this.user_info);
        if (this.user_info && this.user_info.avatar && this.user_info.avatar.data) {
          const binaryData = this.convertBsonToBinary(this.user_info.avatar);
          const base64String = this.convertBinaryToBase64(binaryData);
          const imageUrl = `data:image/png;base64,${base64String}`;
          this.imageData = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        }
        
        this.loaderService.hide();
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      },
    });
  }
  private convertBsonToBinary(bsonData: any): ArrayBuffer {
    const bytes = new Uint8Array(bsonData.data.data);
    return bytes.buffer;
  }
  
  private convertBinaryToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  clickEdit(){
    this.router.navigate(['/index/profile-edit'], { state: { user: this.user_info } });
  }
}
