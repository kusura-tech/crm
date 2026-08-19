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
import { ContactMessage } from '../../core/models/lead.interface';

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

  recentLeads: ContactMessage[] = [
    { id: '1', name: 'Алексей Смирнов', serviceType: 'Разработка лендинга', createdAt: new Date(), status: 'new', email: 'example@gmai.ru', phone: '89898988989', body: 'bgdfbnnygemnhnngfns',  company: 'aaa', subject: 'adda',},
    { id: '2', name: 'ООО "Вектор"', serviceType: 'CRM система под ключ', createdAt: new Date(), status: 'new', email: 'example@gmai.ru', phone: '89898988989', body: 'bgdfbnnygemnhnngfns',  company: 'aaa', subject: 'adda',}
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