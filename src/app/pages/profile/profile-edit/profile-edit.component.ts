import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LoaderService } from 'src/app/services/loader.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profileEditForm!: FormGroup;
  showErrors: boolean = false;
  showDeletePopup: boolean = false;

  msg: String = '';
  msg_status: String = '';
  userDetails: any;
  profilePicture!:  string; // Initialize profilePicture as null;


  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
  ) { 
  }

  ngOnInit(): void {
    if (history.state.user != undefined) {
      this.userDetails = history.state.user      
      this.initializeForm();
    } else {
      this.router.navigate(['/index/profile']);
    }
    if(this.userDetails.avatar){
      this.getProfileImg(this.userDetails.avatar)
    }
  }
  initializeForm(): void {
    this.profileEditForm = this.formBuilder.group({
      name: [this.userDetails.name, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),]],
    });
  }
  clickEdit() {
    const userID = this.userDetails.userID
    const name = this.profileEditForm.value.name;
    this.showErrors = true;
    

    if (this.profileEditForm.status === 'VALID') {
      this.loaderService.show();
      const fileInput = document.getElementById('imageInput') as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        this.userService.editProfile(userID, name, file).subscribe({
          next: (res) => {
            if (res.statusCode === 1) {
              this.loaderService.hide();
              this.router.navigate(['/index/profile']);
            }
          },
          error: (err) => {
            this.loaderService.hide();
            console.log(err);
          }
        });
      } else {
        this.userService.editName(userID, name).subscribe({
          next: (res) => {
            if (res.statusCode === 1) {
              this.loaderService.hide();
              this.router.navigate(['/index/profile']);
            }
          },
          error: (err) => {
            this.loaderService.hide();
            console.log(err);
          }
        });
      }
    } else {
      console.log('Form is invalid.');
    }
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
  clickDelete(){
    this.showDeletePopup = true
  }
  closeDelete(event: string) {
    if (event === 'cancel') {
      this.showDeletePopup = false;
    } else if (event === 'delete') {
      this.showDeletePopup = false;
      this.router.navigate(['/login']);
    }
  }

  profileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.profileEditForm.patchValue({ image: file });
      const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (allowedMimeTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.profilePicture = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file: File = fileInput.files[0];
      const reader = new FileReader();
  
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profilePicture = e.target?.result as string;
        // Store the data in MongoDB or perform other actions here
      };
  
      reader.readAsDataURL(file);
    }
  }
  back_to_profile() {
    this.router.navigate(['/index/profile']);
  }
  

}
