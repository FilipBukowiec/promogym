import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Media } from '../../models/media.model';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-media.component.html',
  styleUrls: ['./admin-media.component.scss'],
})
export class AdminMediaComponent implements OnInit {
  mediaList: Media[] = [];
  selectedFile: File | null = null;

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.fetchMedia();
  }

  fetchMedia(): void {
    this.mediaService.media$.subscribe((media) => {
      this.mediaList = media;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  addMedia(): void {
    if (this.selectedFile) {
      this.mediaService.addMedia(this.selectedFile).subscribe(
        () => {
          console.log('Media added successfully');
          this.selectedFile = null;
          this.mediaService.fetchMedia();
        },
        (error) => {
          console.error('Error adding media:', error);
          alert('Failed to add media.');
        }
      );
    } else {
      console.error('No file selected');
    }
  }

  moveUp(mediaId: string): void {
    this.mediaService.moveUp(mediaId).subscribe(() => {
      console.log('Media moved up successfully');
      this.mediaService.fetchMedia();
    });
  }

  moveDown(mediaId: string): void {
    this.mediaService.moveDown(mediaId).subscribe(() => {
      console.log('Media moved down successfully');
      this.mediaService.fetchMedia();
    });
  }

  deleteMedia(mediaId: string): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this media?'
    );
    if (confirmed) {
      this.mediaService.deleteMedia(mediaId).subscribe(
        () => {
          console.log('Media deleted successfully');
          this.mediaService.fetchMedia();
        },
        (error) => {
          console.error('Error deleting media:', error);
          alert('Failed to delete media.');
        }
      );
    }
  }

  getFullFilePath(filePath: string): string {
    return this.mediaService.getBaseUrl() + filePath;
  }
}
