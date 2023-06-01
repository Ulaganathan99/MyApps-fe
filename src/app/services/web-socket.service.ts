import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket} from 'socket.io-client';
import * as io from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

 private socket: Socket;

  constructor() {
    this.socket = io.connect('https://myappsbackend-fwwz.onrender.com')
   }
   listen(eventname: string) : Observable<any> {
    return new Observable((subscribe) => {
      this.socket.on(eventname, (data: any) => {
        subscribe.next(data)
      })
    })
   }

   emit(eventname: string, data: any) {
    this.socket.emit(eventname, data)
   }

 
}
