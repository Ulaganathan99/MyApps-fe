import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchText:any;
  @Output()  searchEventData = new EventEmitter<any>();
  @Input() pageIndex : any;
  @Input() placeHolder : any;

  constructor() { }

  ngOnInit(): void {
  }
  
  searchChange(event:any){
    this.searchEventData.emit({searchText : event});
  }

}
