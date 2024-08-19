import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  userData!: any;
  selected_side_nav: any = '';

  constructor(private localStorageService: LocalStorageService, private webSocketService: WebSocketService) {
     this.userData = JSON.parse(localStorage.getItem(Constants.APP.SESSION_USER_DATA) || '{}');
   }

  ngOnInit(): void {
  
   
  }
  menuChanged(data:any){
    this.localStorageService.removeItem(Constants.APP.SELECTED_TOPNAV);
    this.selected_side_nav = data
  }
  ngOnDestroy() {
    this.webSocketService.disconnect(this.userData.user_number) // Disconnect when the service is destroyed
  }

}
