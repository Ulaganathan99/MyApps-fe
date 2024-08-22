import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../Constants/constants';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  

  login(email: string, password: string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.LOGIN, {
      email,
      password,
    }); 
  }
  signup(name:string, email: string, number:'string', password: string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.SIGNUP, {
      name,
      email,
      number,
      password,
    });
  }
  signup_verification(email: string, otp:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.SIGNUP_VERIFICATION, {
      email,
      otp
    });
  }
  forgot(email: string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.FORGOT, {
      email,
    }); 
  }
  forgot_verification(email: string, otp:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.FORGOT_VERIFICATION, {
      email,
      otp
    });
  }
  changePassword(email: string, newPassword:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.CHANGE_PASSWORD, {
      email,
      newPassword
    });
  }

  editProfile(userID: string,name: string, image: File): Observable<any> { 
    const formData = new FormData();
  formData.append('userID', userID);
  formData.append('name', name);
  formData.append('image', image, image.name);
    return this.http.post(Constants.BASE_URL + Constants.API.EDIT_PROFILE, formData);
  }
  editName(userID: string,name: string): Observable<any> { 
    const formData = new FormData();
  formData.append('userID', userID);
  formData.append('name', name);
    return this.http.post(Constants.BASE_URL + Constants.API.EDIT_PROFILE, formData);
  }
  fetchUserInfo(user_id: string): Observable<any>{
    return this.http.post(Constants.BASE_URL+Constants.API.FETCH_USER_INFO,{user_id: user_id})
  }
  getProfile(imgUrl: string): Observable<any>{
    return this.http.post(Constants.BASE_URL+Constants.API.FETCH_IMG,{ imgUrl },  { responseType: 'blob' })
  }
  deleteUser(user_id: string): Observable<any>{
    return this.http.post(Constants.BASE_URL+Constants.API.DELETE_USER,{userID: user_id})
  }
}
