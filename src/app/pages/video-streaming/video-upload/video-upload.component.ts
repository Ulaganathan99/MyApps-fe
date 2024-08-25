import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  myVideos(){
    this.router.navigate(['/index/video-streaming/my-video']);
  }
  clickBack(){
    this.router.navigate(['/index/video-streaming/video-list']);
  }

}
