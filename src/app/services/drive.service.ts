import { Injectable } from '@angular/core';
import { Constants } from '../Constants/constants';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  constructor(private http: HttpClient) { }

  uploadFile(data: any): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.UPLOAD_FILE, data); 
  }

  fetchFile(data: any): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.FETCH_FILE, data); 
  }
}
