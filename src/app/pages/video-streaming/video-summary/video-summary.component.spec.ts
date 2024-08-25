import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSummaryComponent } from './video-summary.component';

describe('VideoSummaryComponent', () => {
  let component: VideoSummaryComponent;
  let fixture: ComponentFixture<VideoSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
