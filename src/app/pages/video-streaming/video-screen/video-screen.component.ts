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
    const qualityDisplay = document.getElementById('quality-display');
    const video = this.playerRef.nativeElement;
    const source = 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8';
    // const source = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
    
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        let availableQualities = hls.levels.map(level => level.height);
        availableQualities = [-1, ...availableQualities]
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
            // 'download',
            'fullscreen'
          ],
          quality: {
            default: -1, // Auto
            options: [-1, ...availableQualities], // Include auto (-1) and the 
            forced: true,
            onChange: (newQuality: number | string) => this.updateQuality(newQuality)
          }
        };

        const player = new Plyr(video, plyrOptions);
        

        // Apply custom labels after Plyr initializes
        player.on('ready', () => {
          // Update all quality buttons to have aria-checked="false"
          const qualityButtons = document.querySelectorAll('button[data-plyr="quality"]');
          qualityButtons.forEach(button => {
            button.setAttribute('aria-checked', 'false');
          });

          const autoQualityButton = document.querySelector('button[data-plyr="quality"][value="-1"]');
            // Check if the button exists before trying to update it
          if (autoQualityButton) {
            // Find the span inside the button and update its text content
            const span = autoQualityButton.querySelector('span');
            if (span) {
              span.textContent = 'Auto';
              autoQualityButton.setAttribute('aria-checked', 'true');
            }
          }
          this.updateQuality(-1);
        });
        
        this.addQualityDisplayAfterFullscreen()
        hls.on(Hls.Events.LEVEL_SWITCHED, () => this.updateQualityValue());
        // Handle quality change based on bandwidth
        // hls.on(Hls.Events.LEVEL_LOADED, () => {
        //   console.log('level loaded')

        //     this.updateQualityValue();
        // });

        // hls.on(Hls.Events.LEVEL_UPDATED, () => {
        //     this.updateQualityValue();
        // });
        // Listen for fragment loading and parsing events as a fallback
      //   hls.on(Hls.Events.FRAG_LOADED, () => {
      //     this.updateQualityValue();
      // });


      // Periodic check to ensure the quality display is accurate
      // setInterval(() => {
      //     this.updateQualityValue();
      // }, 1000); 
        (window as any).player = player;
        (window as any).hls = hls;
      });
      
      (window as any).hls = hls;
    }
    // Detect full-screen changes and adjust the display
    video.addEventListener('enterfullscreen', () => {
        if (qualityDisplay) {
            qualityDisplay.classList.add('fullscreen');
        }
    });

    video.addEventListener('exitfullscreen', () => {
        if (qualityDisplay) {
            qualityDisplay.classList.remove('fullscreen');
        }
    });
  }
  addQualityDisplayAfterFullscreen() {
    const fullscreenButton = document.querySelector('.plyr__controls__item[data-plyr="fullscreen"]');
    
    if (fullscreenButton) {
        // Create the quality display element
        const qualityDisplay = document.createElement('span');
        qualityDisplay.id = 'custom-quality-display';
        qualityDisplay.style.color = '#fff';
        qualityDisplay.style.fontWeight = 'bold';
        qualityDisplay.style.marginLeft = '10px';
        
        // Insert it after the fullscreen button
        fullscreenButton.insertAdjacentElement('afterend', qualityDisplay);

        // Initial update of quality value
        // this.updateQualityInControls();
    }
}

  updateQuality(newQuality: number | string) {
    const hls = (window as any).hls as Hls;
    if (newQuality === -1) {
      // Enable automatic quality selection by setting hls.currentLevel to -1
      hls.currentLevel = -1;
      setTimeout(() => {
        this.updateQualityUI()
      }, 0);
    } else {
      // Manual quality selection
      hls.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          hls.currentLevel = levelIndex;
        }
      });
    }
  }
  updateQualityUI() {
    // Find all quality settings buttons
    const qualitySettingsButtons = document.querySelectorAll('button[data-plyr="settings"]');

    // Loop through buttons to find the one with "Quality" heading
    qualitySettingsButtons.forEach(button => {
      const headingSpan = button.querySelector('span');
      if (headingSpan && headingSpan.textContent?.includes('Quality')) {
        // Find the quality display span within the button
        const qualityDisplaySpan = button.querySelector('.plyr__menu__value');
        if (qualityDisplaySpan) {
          // Determine the currently selected quality
          const selectedQuality = (document.querySelector('button[data-plyr="quality"][aria-checked="true"]') as HTMLElement).getAttribute('value');
          
          if (selectedQuality === '-1') {
            qualityDisplaySpan.textContent = 'Auto';
          } else {
            // Find the span inside the button and update its text content to show selected quality
            const selectedQualityButton = document.querySelector(`button[data-plyr="quality"][value="${selectedQuality}"] span`);
            if (selectedQualityButton) {
              qualityDisplaySpan.textContent = selectedQualityButton.textContent || '';
            }
          }
        }
      }
    });
  }
  updateQualityValue() {
    const hls = (window as any).hls as Hls;
    const qualityDisplay = document.getElementById('custom-quality-display');
    
    if (qualityDisplay) {
        const currentLevel = hls.currentLevel;
        let currentQuality = 'Auto'; // Default to Auto

        // If a specific level is set (not auto), display the height
        if (currentLevel !== -1 && hls.levels[currentLevel]) {
            currentQuality = hls.levels[currentLevel].height + 'p';
        }

        // Update quality display
        qualityDisplay.textContent = `${currentQuality}`;
    }

   
  }
  clickBack(){
    this.router.navigate(['/index/video-streaming/video-list']);
  }

}
