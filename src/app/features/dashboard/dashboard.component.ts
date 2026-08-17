import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { DashboardService } from '../../core/services/dashboard.service';
import { StatCard } from '../../core/models/stat.interface';
import { ActiveProject } from '../../core/models/project.interface';
import { Lead } from '../../core/models/lead.interface';

// Импортируем вынесенные диалоги
import { ClientDialogComponent } from '../../shared/components/client-dialog/client-dialog.component';
import { ProjectDialogComponent } from '../../shared/components/project-dialog/project-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressBarModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private dialog = inject(MatDialog);

  stats$!: Observable<StatCard[]>;
  activeProjects$!: Observable<ActiveProject[]>;

  recentLeads: Lead[] = [
    { id: '1', name: 'Алексей Смирнов', service: 'Разработка лендинга', date: 'Сегодня, 11:30', status: 'new' },
    { id: '2', name: 'ООО "Вектор"', service: 'CRM система под ключ', date: 'Вчера, 18:20', status: 'new' }
  ];

  ngOnInit(): void {
    this.stats$ = this.dashboardService.getStats();
    this.activeProjects$ = this.dashboardService.getActiveProjects();
  }

  // Открытие диалога создания проекта
  openCreateProjectDialog(): void {
    this.dialog.open(ProjectDialogComponent, {
      width: '520px',
      panelClass: 'custom-dialog-container'
    });
  }

  // Открытие диалога создания клиента
  openCreateClientDialog(): void {
    this.dialog.open(ClientDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });
  }
}