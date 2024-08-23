import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket} from 'socket.io-client';
import * as io from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;
  private userNumber: any;
  constructor() {
    // this.socket = io.connect('https://myapps-backend-container.onrender.com')
    this.socket = io.connect('https://myappsbackend-fwwz.onrender.com') 
    // this.socket = io.connect('http://localhost:3000')
  }

  connect(userNumber: string): void {
    this.userNumber = userNumber
    this.socket.emit('online', { userNumber });
  }

  disconnect(userNumber: string): void {
    this.socket.emit('disConnect', { userNumber });
    this.userNumber = undefined;
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
