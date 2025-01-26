import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common';
import { News } from '../../models/news.model';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, OnDestroy {
  newsList: News[] = [];
  private newsUpdateSubscription: Subscription = new Subscription();

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.subscribeToNewsUpdates();
  }

  subscribeToNewsUpdates(): void {
    this.newsUpdateSubscription = this.newsService.news$.subscribe((news: News[]) => {
      this.newsList = news; // Aktualizacja listy newsów
    });
  }

  ngOnDestroy(): void {
    this.newsUpdateSubscription.unsubscribe(); // Wyczyść subskrypcje
  }
}
