import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from 'src/app/Constants/constants';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  @Input() tab_list!: any;
  @Output() tab_change = new EventEmitter<any>();
  @Output() tab_key = new EventEmitter<any>();

  selected_tab: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  tabChange(key: string) {
    // console.log(key);
    this.tab_key.emit(key);
    this.tab_change.emit(key);
    this.selected_tab = key;
    // localStorage.setItem(Constants.APP.SELECTED_TAB,JSON.stringify(this.selected_tab));
    // localStorage.removeItem(Constants.APP.SELECTED_PROFILE_TAB);
  }

  

}
