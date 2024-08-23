import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { VideosService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss']
})
export class VideosListComponent implements OnInit {
  searchText: any;
  numArray = Array(5)
  darkMode: boolean = false;
  showVideo: boolean =false;

  constructor(private searchService: SearchService, private videosService: VideosService) { }

  ngOnInit(): void {
  }
  onSearch(event: any) {
    this.searchText = event.searchText;
    this.searchService.setSearchText(event.searchText);
  }
  uploadVideos(){
    this.videosService.uploadVideos().subscribe({
      next: (res) => {

      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
