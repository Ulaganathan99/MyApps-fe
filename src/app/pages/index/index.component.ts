import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  userDetails: any;

  selected_side_nav: any = '';

  constructor(private localStorageService: LocalStorageService) {
   
   }

  ngOnInit(): void {
  
   
  }
  menuChanged(data:any){
    this.localStorageService.removeItem(Constants.APP.SELECTED_TOPNAV);
    this.selected_side_nav = data
  }

}
