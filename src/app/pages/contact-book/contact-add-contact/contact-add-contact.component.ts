import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/Constants/constants';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact-add-contact',
  templateUrl: './contact-add-contact.component.html',
  styleUrls: ['./contact-add-contact.component.scss']
})
export class ContactAddContactComponent implements OnInit {

  userDetails: any;
  addContactForm!: FormGroup;
  showErrors: boolean = false;

  msg: String = '';
  msg_status: String = '';

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.initializeForm();
  }
  initializeForm(): void {
    this.addContactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      mobileNumber: ['', [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),]],
    });
  }

  clickAdd(){

    const contactName = this.addContactForm.value.name;
    const contactNumber = this.addContactForm.value.mobileNumber;

    this.showErrors = true;

    if (this.addContactForm.status === 'VALID') {
      this.contactService.addContact(this.userDetails.user_id,contactName,contactNumber).subscribe({
        next: (res) => {
          if (res.statusCode == 1) {
            if(res.error){
              this.msg = res.error,
              this.msg_status = 'error'
            }else if(res.success) {
              this.msg = res.success,
              this.msg_status = 'success'
            }
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

}
