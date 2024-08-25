import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-video',
  templateUrl: './my-video.component.html',
  styleUrls: ['./my-video.component.scss']
})
export class MyVideoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  uploadVideo(){
    this.router.navigate(['/index/video-streaming/video-upload']);
  }
  clickBack(){
    this.router.navigate(['/index/video-streaming/video-list']);
  }

}
