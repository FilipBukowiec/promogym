import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FullscreenService } from '../../services/fullscreen.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, LoaderComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements AfterViewInit {
  isLoading: boolean = true;
  isVideoEnded: boolean = false;
  isFullscreen$: Observable<boolean>;

  @ViewChild('videoElement', { static: false })
  videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private fullscreenService: FullscreenService) {
    this.isFullscreen$ = this.fullscreenService.isFullscreen$;
  }

  ngAfterViewInit(): void {
    if (this.videoElement) {
      const video = this.videoElement.nativeElement;


      video.addEventListener('loadeddata', () => {
        this.isLoading = false;
      });

      video.addEventListener('ended', () => {
        this.isVideoEnded = true;
      });

      video.muted = true;
      video.play().catch((error) => {
        console.error('Błąd odtwarzania wideo:', error);
      });
    } else {
      console.error('Element wideo nie został znaleziony.');
    }
  }

  toggleFullscreen(): void {
    this.fullscreenService.toggleFullscreen();
  }
}
