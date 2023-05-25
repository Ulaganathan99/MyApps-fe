import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../Constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  addContact(userID:string, contactName: string, contactNumber: string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.ADD_CONTACT, {
      userID,
      contactName,
      contactNumber,
    });
  }
  getContacts(userID:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.FETCH_CONTACT_INFO, {
      userID
    });
  }
}
