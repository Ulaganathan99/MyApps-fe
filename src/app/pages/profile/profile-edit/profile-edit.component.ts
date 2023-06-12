import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
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
  ) { 
  }

  ngOnInit(): void {
    if (history.state.user != undefined) {
      this.userDetails = history.state.user
      this.initializeForm();

    } else {
      this.router.navigate(['/index/profile']);
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
    const profilePicture = this.profilePicture;
    this.showErrors = true;

    if (this.profileEditForm.status === 'VALID') {
      this.userService.editProfile(userID,name, profilePicture).subscribe({
        next: (res) => {
          if (res.statusCode == 1) {
            localStorage.setItem(
              Constants.APP.SESSION_USER_DATA,
              JSON.stringify(res.user)
              
            );
            this.profilePicture = ''
          } 
        },
        error: (err) => { 
          console.log(err);
        },
      });
    } else {
      console.log('invalid');
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

  profileChange() {
    const fileInput: HTMLInputElement = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.jpeg, .jpg, .png'; 
    fileInput.addEventListener('change', (event: Event) => this.onFileSelected(event));
    fileInput.click();
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
