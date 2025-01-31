import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FullscreenService } from '../../services/fullscreen.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [LoaderComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements AfterViewInit {
  isLoading: boolean = true;
  isVideoEnded: boolean = false;
  isFullscreen$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  @ViewChild('videoElement', { static: false })
  videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private fullscreenService: FullscreenService, public auth: AuthService, private router: Router) {
    this.isFullscreen$ = this.fullscreenService.isFullscreen$;
    this.isLoggedIn$ = this.auth.isAuthenticated$;
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

    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        console.log('✅ Użytkownik zalogowany – przekierowanie na dashboard');
        this.router.navigate(['/dashboard']);
      }
    });


  }

start():void{
  this.auth.isAuthenticated$.subscribe(isAuthenticated => {
    if (isAuthenticated) {
      this.router.navigate(['/dashboard']); }
  });
}

  toggleFullscreen(): void {
    this.fullscreenService.toggleFullscreen();
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: document.location.origin} }); 
  }

 isLogin(){
  this.auth.isAuthenticated$.subscribe(isAuthenticated => {
    if (isAuthenticated) {
      return true;

 }else{
  return false;
 }
  })}
}
