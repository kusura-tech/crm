import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface NavItem {
  label: string;
  icon: string;
  link: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Дашборд', icon: 'dashboard', link: '/dashboard' },
    { label: 'Заявки', icon: 'inbox', link: '/leads', badge: 3 },
    { label: 'Клиенты', icon: 'people', link: '/clients' },
    { label: 'Проекты', icon: 'business_center', link: '/projects' },
    { label: 'Задачи', icon: 'check_box', link: '/tasks' },
    { label: 'Финансы', icon: 'payments', link: '/payments' },
    { label: 'Настройки', icon: 'settings', link: '/settings' }
  ];
}