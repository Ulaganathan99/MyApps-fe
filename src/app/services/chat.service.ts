import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../Constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }
  getChatContacts(userID:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.GET_CHAT_CONTACTS, {
      userID
    });
  }
  getAllChatContacts(userID:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.GET_ALL_CHAT_CONTACTS, {
      userID
    });
  }
  getInviteContacts(userID:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.GET_INVITE_CONTACTS, {
      userID
    });
  }
  sendChatMsg(message:string, owner:string, receiver:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.SEND_MSG, {
      message,
      owner,
      receiver
    });
  }
  getChatMsg( owner:string, receiver:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.GET_MSG, {
      owner,
      receiver
    });
  }
  deleteChatHistory( owner:string, receiver:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.DELETE_CHAT_HISTORY, {
      owner,
      receiver
    });
  }
  getSearchChatContact( userID:string, searchText:string): Observable<any> {
    return this.http.post(Constants.BASE_URL + Constants.API.GET_SEARCH_CHAT_CONTACT, {
      userID,
      searchText
    });
  }
}
