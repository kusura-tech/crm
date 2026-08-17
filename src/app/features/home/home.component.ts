import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatCard } from '../../core/models/stat.interface';
import { ActiveProject } from '../../core/models/project.interface'
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Lead } from '../../core/models/lead.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // Статистика (KPI)
  stats: StatCard[] = [
    { title: 'Активные проекты', value: 5, change: '+2 за месяц', icon: 'business_center', colorClass: 'primary' },
    { title: 'Новые заявки', value: 3, change: 'Требуют ответа', icon: 'mark_email_unread', colorClass: 'accent' },
    { title: 'Доход (текущий мес.)', value: '185 000 ₽', change: '+12% к прошлому', icon: 'payments', colorClass: 'success' },
    { title: 'Задачи на сегодня', value: 8, change: '2 горит', icon: 'task_alt', colorClass: 'warn' }
  ];

  // Новые заявки
  recentLeads: Lead[] = [
    { id: '1', name: 'Алексей Смирнов', service: 'Разработка лендинга', date: 'Сегодня, 11:30', status: 'new' },
    { id: '2', name: 'ООО "Вектор"', service: 'CRM система под ключ', date: 'Вчера, 18:20', status: 'new' }
  ];

  // Активные проекты
  activeProjects: ActiveProject[] = [
    { id: '101', title: 'Редизайн интернет-магазина', client: 'ООО "Маркет"', progress: 75, deadline: '20 Авг' },
    { id: '102', title: 'CRM Разработка', client: 'Частный клиент', progress: 30, deadline: '05 Сен' }
  ];
}