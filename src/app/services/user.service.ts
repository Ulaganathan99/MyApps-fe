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

  editProfile(userID: string,name: string, profilePictureData:  ArrayBuffer | null): Observable<any> {

    const payload = {
      userID,
      name,
      avatar: {
        data: profilePictureData,
        contentType: 'image/png'
      }
    };
    console.log("service");
    
  console.log(payload.avatar);
  
    return this.http.post(Constants.BASE_URL + Constants.API.EDIT_PROFILE, payload);
  }
  fetchUserInfo(user_id: string): Observable<any>{
    return this.http.post(Constants.BASE_URL+Constants.API.FETCH_USER_INFO,{user_id: user_id})
  }
  deleteUser(user_id: string): Observable<any>{
    return this.http.post(Constants.BASE_URL+Constants.API.DELETE_USER,{userID: user_id})
  }
}
