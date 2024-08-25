import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { VideosService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss']
})
export class VideosListComponent implements OnInit {
  numArray = Array(5)
  darkMode: boolean = false;
  showVideo: boolean =false;

  constructor(private searchService: SearchService, private videosService: VideosService, private router: Router) { }

  ngOnInit(): void {
  }
  uploadVideos(){
    this.router.navigate(['/index/video-streaming/video-upload']);
    // this.videosService.uploadVideos().subscribe({
    //   next: (res) => {

    //   },
    //   error: (err) => {
    //     console.log(err)
    //   }
    // })
  }
  clickVideo(){
    this.router.navigate(['/index/video-streaming/video-screen']);
  }
  myVideos(){
    this.router.navigate(['/index/video-streaming/my-video']);
  }
  
  

}
