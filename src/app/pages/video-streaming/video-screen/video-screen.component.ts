import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as Plyr from 'plyr';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-screen',
  templateUrl: './video-screen.component.html',
  styleUrls: ['./video-screen.component.scss']
})
export class VideoScreenComponent implements OnInit {
  @ViewChild('player') playerRef!: ElementRef<HTMLVideoElement>;

  constructor(private router: Router){}

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    const video = this.playerRef.nativeElement;
    const source = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
    
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const availableQualities = hls.levels.map(level => level.height);

        const plyrOptions = {
          controls: [
            'play-large',
            'restart', 
            'rewind', 
            'play', 
            'fast-forward', 
            'progress', 
            'current-time', 
            'duration', 
            'mute', 
            'volume', 
            'captions', 
            'settings', 
            'pip', 
            'airplay',
            'download',
            'fullscreen'
          ],
          quality: {
            default: availableQualities[0],
            options: availableQualities,
            forced: true,
            onChange: (newQuality: number) => this.updateQuality(newQuality)
          }
        };

        new Plyr(video, plyrOptions);
      });
      
      hls.attachMedia(video);
      (window as any).hls = hls;
    }
  }

  updateQuality(newQuality: number) {
    const hls = (window as any).hls as Hls;
    hls.levels.forEach((level, levelIndex) => {
      if (level.height === newQuality) {
        hls.currentLevel = levelIndex;
      }
    });
  }
  clickBack(){
    this.router.navigate(['/index/video-streaming/video-list']);
  }

}
