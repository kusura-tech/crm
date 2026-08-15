import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  // private authService = inject(AuthService);
  
  // Данные текущего пользователя (можно получать через Signal или Observable из AuthService)
  // currentUser$ = this.authService.currentUser$; 
  unreadNotificationsCount = 3; // Временный заголовок под уведомления

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  logout(): void {
    // this.authService.logout();
  }

  currentUser$ = {
    displayName: "user",
    photoURL: 'https://images.unsplash.com/photo-1640951613773-54706e06851d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
  };
}