import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RadioStream, Settings } from '../../models/settings.model';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../services/settings.service';
import { AuthService } from '../../services/auth.service'; // Importowanie AuthService

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
})
export class AdminSettingsComponent implements OnInit {
  settings: Settings = {
    selectedRadioStream: '',
    radioStreamList: [],
    footerVisibilityRules: [],
    pictureSlideDuration: 0,
  };

  time: number[] = Array.from({ length: 60 }, (_, i) => i);

  newStartMinute: number | null = null;
  newEndMinute: number | null = null;

  newRadioDescription: string = '';
  newRadioUrl: string = '';
  editRadioStreamIndex: number | null = null;
  editFooterVisibilityIndex: number | null = null;

  loading: boolean = false; // Dodano stan ładowania
  error: string | null = null; // Dodano stan błędu

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.settingsService.getSettings().subscribe({
      next: (response) => {
        this.settings = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error =
          'Błąd podczas ładowania ustawień. Spróbuj ponownie później.';
        console.error('Błąd podczas ładowania', error);
      },
    });
  }

  addFooterVisibilityRule() {
    if (this.newStartMinute === null || this.newEndMinute === null) {
      alert('Please select both start and end minutes.');
      return;
    } else if (this.newStartMinute >= this.newEndMinute) {
      alert('Start time must be less than end time.');
      return;
    }
    this.settings.footerVisibilityRules.push({
      startMinute: this.newStartMinute,
      endMinute: this.newEndMinute,
    });
    console.log(this.settings.footerVisibilityRules);
    this.newStartMinute = null;
    this.newEndMinute = null;
  }

  addRadioStream() {
    if (
      this.newRadioDescription.trim() === '' ||
      this.newRadioUrl.trim() === ''
    ) {
      alert('Please fill in both fields.');
      return;
    }
    this.settings.radioStreamList.push({
      url: this.newRadioUrl,
      description: this.newRadioDescription,
    });

    this.newRadioDescription = '';
    this.newRadioUrl = '';
  }

  deleteRadioStream(index: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this radio stream?'
    );
    if (confirmDelete) {
      const deletedUrl = this.settings.radioStreamList[index]?.url;
      this.settings.radioStreamList.splice(index, 1);

      if (this.settings.selectedRadioStream === deletedUrl) {
        this.settings.selectedRadioStream = null;
      }
    }
  }

  editRadioStream(index: number): void {
    this.editRadioStreamIndex = index;
  }

  saveRadioStream(index: number): void {
    this.editRadioStreamIndex = null;
  }

  editFooterVisibilityRule(index: number): void {
    this.editFooterVisibilityIndex = index;
  }

  saveFooterVisibilityRule(index: number): void {
    const rule = this.settings.footerVisibilityRules[index];

    if (rule.startMinute === null || rule.endMinute === null) {
      alert('Both start and end minutes must be selected.');
      return;
    }
    if (rule.startMinute >= rule.endMinute) {
      alert('Start minute must be less than end minute.');
      return;
    }

    this.editFooterVisibilityIndex = null;
  }

  deleteFooterVisibilityRule(index: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this Footer Visibility Rule?'
    );
    if (confirmDelete) {
      this.settings.footerVisibilityRules.splice(index, 1);
    }
  }

  saveSettings(): void {
    this.settingsService.saveSettings(this.settings).subscribe({
      next: (response) => {
        alert('Settings saved successfully');
        console.log(response);
      },
      error: (error) => {
        console.error('Błąd podczas zapisywania', error);
        alert('Błąd podczas zapisywania ustawień. Spróbuj ponownie później.');
      },
    });
  }

  // checkIfLoggedIn(): void {
  //   this.authService.isLoggedIn().subscribe((loggedIn) => {
  //     if (!loggedIn) {
  //       alert('You must be logged in to modify settings');
  //     }
  //   });
  // }
}
