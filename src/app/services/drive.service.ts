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
  getSinglePresignedUrl(data: any): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.GET_SINGLE_PRESIGNED_URL, data); 
  }
  getMultipartPresignedUrls(data: any): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.GET_MULTIPART_PRESIGNED_URL, data); 
  }
  startMultipartUpload(data: any): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.START_MULTIPART_UPLOAD, data); 
  }
  completeMultipartUpload(data: any): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.COMPLETE_MULTIPART_UPLOAD, data); 
  }
  abortMultipartUpload(data: any): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.ABORT_MULTIPART_UPLOAD, data); 
  }
  deleteSingleFile(data: any): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.DELETE_SINGLE_FILE, data); 
  }
  renameFile(data: any): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.RENAME_FILE, data); 
  }
}
