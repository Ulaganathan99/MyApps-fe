import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss']
})
export class VideosListComponent implements OnInit {
  searchText: any;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }
  onSearch(event: any) {
    this.searchText = event.searchText;
    this.searchService.setSearchText(event.searchText);
  }

}
