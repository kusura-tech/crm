import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatTabsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private document = inject(DOCUMENT);

  userProfile = {
    displayName: '',
    email: '',
    photoURL: ''
  };
  isSaving = false;
  isUploading = false;
  isLightTheme = this.document.documentElement.dataset['theme'] === 'light';

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userProfile.displayName = user.displayName || '';
        this.userProfile.email = user.email || '';
        this.userProfile.photoURL = user.photoURL || '';
      }
    });
  }

  saveProfile(): void {
    if (this.isSaving) return;
    this.isSaving = true;
    this.authService.updateUserProfile(this.userProfile.displayName, this.userProfile.photoURL)
      .catch((error) => console.error('Не удалось сохранить профиль:', error))
      .finally(() => this.isSaving = false);
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    this.isUploading = true;
    this.authService.uploadProfilePhoto(file)
      .then((photoURL) => this.userProfile.photoURL = photoURL)
      .catch((error) => console.error('Не удалось загрузить фото:', error))
      .finally(() => this.isUploading = false);
  }

  toggleTheme(): void {
    this.isLightTheme = !this.isLightTheme;
    const theme = this.isLightTheme ? 'light' : 'dark';
    this.document.documentElement.dataset['theme'] = this.isLightTheme ? theme : '';
    localStorage.setItem('crm-theme', theme);
  }
}