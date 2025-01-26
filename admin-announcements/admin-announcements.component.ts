import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../services/announcement.service';
import { Announcement } from '../../models/announcement.model';
import { io } from 'socket.io-client'; 

@Component({
  selector: 'app-admin-announcements',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-announcements.component.html',
  styleUrls: ['./admin-announcements.component.scss'],
})
export class AdminAnnouncementsComponent implements OnInit, OnDestroy {
  announcementList: Announcement[] = [];
  selectedFile: File | null = null;
  description: string = '';
  scheduleType: 'cyclic' | 'oneTime' = 'oneTime';
  oneTimeDate: string = '';

  // Cykliczne opcje
  daysOfWeek: string[] = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  minutes: number[] = Array.from({ length: 60 }, (_, i) => i);

  selectedDays: boolean[] = new Array(7).fill(false);
  selectedHours: boolean[] = new Array(24).fill(false);
  selectedMinutes: boolean[] = new Array(60).fill(false);

  daysOption: 'allDays' | 'selectedDays' = 'allDays';
  hoursOption: 'allHours' | 'selectedHours' = 'allHours';
  minutesOption: 'allMinutes' | 'selectedMinutes' = 'allMinutes';

  

  private socket: any; // Zmienna do przechowywania połączenia Socket.IO

  constructor(private announcementService: AnnouncementService) { }

  ngOnInit(): void {
    this.fetchAnnouncements();
    this.setupSocket(); // Inicjalizacja połączenia z Socket.IO
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect(); // Rozłączanie Socket.IO przy zniszczeniu komponentu
    }
  }

  fetchAnnouncements(): void {
    this.announcementService.fetchAnnouncements(); // Użyj metody fetchAnnouncements
    this.announcementService.announcements$.subscribe(
      (announcements: Announcement[]) => {
        this.announcementList = announcements; // Zaktualizuj listę ogłoszeń
      },
      (error: any) => {
        console.error('Błąd podczas pobierania ogłoszeń:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  addAnnouncement(): void {
    if (this.selectedFile && this.description) {
      const announcement: Announcement = {
        _id: '', // Nowe ogłoszenie, które nie ma jeszcze ID
        description: this.description,
        fileName: this.selectedFile.name,
        scheduleType: this.scheduleType,
        scheduledTime: this.scheduleType === 'oneTime' ? this.oneTimeDate : undefined,
        scheduleOption: this.scheduleType === 'cyclic'
          ? (this.daysOption === 'allDays' ? 'everyDay' : 'specificDay')
          : undefined,
        selectedDays: this.scheduleType === 'cyclic'
          ? this.selectedDays.map((checked, index) => checked ? index : -1).filter(i => i >= 0)
          : undefined,
        selectedHours: this.scheduleType === 'cyclic'
          ? this.selectedHours.map((checked, index) => checked ? index : -1).filter(i => i >= 0)
          : undefined,
        selectedMinutes: this.scheduleType === 'cyclic'
          ? this.selectedMinutes.map((checked, index) => checked ? index : -1).filter(i => i >= 0)
          : undefined,
        cronSchedule: '', // Wartość cronSchedule jest pusta, jeśli plan jest "cykliczny"
      };
  
      this.announcementService.addAnnouncement(announcement, this.selectedFile).subscribe(
        (response: Announcement) => {
          console.log('Ogłoszenie dodane', response);
          
          // Odświeżenie listy po dodaniu ogłoszenia
          this.fetchAnnouncements();
  
          // Emitowanie zmiany na serwerze
          this.socket.emit('announcementsUpdated', announcement);
  
          // Resetowanie pól po dodaniu ogłoszenia
          this.resetForm();
        },
        (error: any) => {
          console.error('Błąd podczas dodawania ogłoszenia:', error);
        }
      );
    }
  }
  
  // Dodanie metody resetForm do czyszczenia pól formularza
  resetForm(): void {
    this.selectedFile = null; // Wyczyść wybrany plik
    this.description = ''; // Wyczyść opis
  }

  deleteAnnouncement(id: string): void {
    this.announcementService.deleteAnnouncement(id).subscribe(
      () => {
        console.log('Ogłoszenie usunięte!');
        this.fetchAnnouncements(); // Odświeżenie listy ogłoszeń po usunięciu
        this.socket.emit('announcementsUpdated'); // Emitowanie zmiany na serwerze
      },
      (error: any) => console.error('Błąd podczas usuwania ogłoszenia:', error)
    );
  }

  // Ustawienie połączenia z Socket.IO
  setupSocket(): void {
    this.socket = io('https://crossfitbytom.promogym.pl', {
      path: '/backend/socket.io',  // Ustawienie ścieżki
    });
    // Nasłuchiwanie na zdarzenie 'announcementsUpdated' wysyłane z backendu
    this.socket.on('announcementsUpdated', (updatedAnnouncement: Announcement) => {
      console.log('Ogłoszenie zaktualizowane:', updatedAnnouncement);
      this.fetchAnnouncements(); // Odświeżenie listy ogłoszeń po otrzymaniu informacji o zmianach
    });
  }

  // Metoda pomocnicza do wyświetlania harmonogramu emisji
  getScheduledTime(announcement: Announcement): string {
    let scheduledTimeMessage = '';
    if (announcement.scheduleType === 'oneTime') {
      scheduledTimeMessage = `Jednorazowo: ${announcement.scheduledTime}`;
    } else if (announcement.scheduleType === 'cyclic') {
      const days = announcement.selectedDays?.map(dayIndex => this.daysOfWeek[dayIndex]).join(', ') || 'Wszystkie dni';
      const hours = announcement.selectedHours?.map(hour => `${hour}:00`).join(', ') || 'Wszystkie godziny';
      const minutes = announcement.selectedMinutes?.map(min => `${min}`).join(', ') || 'Wszystkie minuty';

      scheduledTimeMessage = `Cyklicznie: Dni: ${days}, Godziny: ${hours}, Minuty: ${minutes}`;
    } else {
      scheduledTimeMessage = 'Brak harmonogramu';
    }

    return scheduledTimeMessage;
  }
}
