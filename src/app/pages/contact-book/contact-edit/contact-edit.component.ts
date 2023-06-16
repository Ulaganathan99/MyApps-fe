import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/Constants/constants';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {
  @Output() closeEdit = new EventEmitter<any>();
  @Output() contactUpdated = new EventEmitter<any>();
  @Input() contactDetail: any;

  userDetails: any;
  editContactForm!: FormGroup;
  showErrors: boolean = false;
  isInputFocused: boolean = false;

  msg: String = '';
  msg_status: String = '';

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(
      localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}'
    );
    this.initializeForm();
    console.log(this.contactDetail);
    
  }
  initializeForm(): void {
    this.editContactForm = this.formBuilder.group({
      name: [this.contactDetail.name, [Validators.required, Validators.maxLength(40)]],
      mobileNumber: [this.contactDetail.number, [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),]],
    });
  }
  clickEdit(){
    this.isInputFocused = false
    let contactName = this.editContactForm.value.name;
    let contactNumber = this.editContactForm.value.mobileNumber;
    if(contactName === this.contactDetail.name){
      contactName = ''
    }
    if(contactNumber === this.contactDetail.number){
      contactNumber = ''
    }
    if(contactName || contactNumber){
      this.contactService.editContact(this.userDetails.user_id, contactName, contactNumber, this.contactDetail._id).subscribe({
        next: (res) => {    
          if (res.statusCode == 1) {
           if(res.error){
            this.msg = res.error,
            this.msg_status = 'error'
          }else if(res.success) {
            this.msg = res.success,
            this.msg_status = 'success'
          }
          this.contactUpdated.emit();
        }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  close(){
    this.closeEdit.emit(false);
  }
  inputFocused(){    
    this.msg = ''
    this.isInputFocused = true
  }

}
