import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { VideosService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-video-summary',
  templateUrl: './video-summary.component.html',
  styleUrls: ['./video-summary.component.scss']
})
export class VideoSummaryComponent implements OnInit {
  searchText: any;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }
  onSearch(event: any) {
    this.searchText = event.searchText;
    this.searchService.setSearchText(event.searchText);
  }

}
