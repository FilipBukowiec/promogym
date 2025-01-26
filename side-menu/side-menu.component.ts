import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FullscreenService } from '../../services/fullscreen.service';
import { DataService } from '../../services/data.service';
import { RadioStreamService } from '../../services/radio-stream.service';
import { AnnouncementService } from '../../services/announcement.service'; 
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit, AfterViewInit {
  isLoggedIn: boolean = false;
  isOnStartPage: boolean = false;
  shouldRefresh: boolean = false;
  isFullscreen$: Observable<boolean>;
  isPlaying$: Observable<boolean>; 

  constructor(
    private authService: AuthService,
    private fullscreenService: FullscreenService,
    private router: Router,
    private dataService: DataService,
    public radioStreamService: RadioStreamService,
    private announcementService: AnnouncementService 
  ) {
    this.isFullscreen$ = this.fullscreenService.isFullscreen$;
    this.isPlaying$ = this.announcementService.isPlaying$; 
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isOnStartPage = event.url === '/start';
      });
  }

  ngAfterViewInit(): void {}

  toggleFullscreen(): void {
    this.fullscreenService.toggleFullscreen();
  }

  logOut(): void {
    this.authService.logout();
  }

  refreshComponents(componentKeys: string[]): void {
    const newData: { [key: string]: boolean } = {};
    componentKeys.forEach((key) => {
      newData[key] = false;
    });
    this.dataService.updateData(newData);
    setTimeout(() => {
      const updatedData: { [key: string]: boolean } = {};
      componentKeys.forEach((key) => {
        updatedData[key] = true;
      });
      this.dataService.updateData(updatedData);
    }, 100);
  }

  navigateToStart(): void {
    if (!this.isOnStartPage) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/start']).then(() => {
        this.shouldRefresh = true;
      });
    } else {
      if (this.shouldRefresh) {
        this.shouldRefresh = false;
      }
    }
  }

  onStartClick(event: MouseEvent): void {
    if (this.isOnStartPage) {
      this.refreshComponents(['swiper', 'footer']);
      event.preventDefault();
    } else {
      this.navigateToStart();
    }
  }

  toggleStream(): void {
    this.radioStreamService.toggleStream();
  }


  toggleAnnouncement(): void {
    console.log('toggleAnnouncement wywołany');
    this.announcementService.toggleIsPlaying(); 
  }
}
