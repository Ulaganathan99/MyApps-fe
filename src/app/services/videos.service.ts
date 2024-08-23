import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../Constants/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  constructor(private http: HttpClient) { }

  uploadVideos(): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.UPLOAD_VIDEOS, {}); 
  }
}
