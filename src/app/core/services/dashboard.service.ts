import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { ProjectsService } from './projects.service';
import { StatCard } from '../models/stat.interface';
import { ActiveProject, Project } from '../models/project.interface';
import { ClientsService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private projectsService = inject(ProjectsService);
  private clientsService = inject(ClientsService);

  // Динамический расчет KPI показателей
  getStats(): Observable<StatCard[]> {
    return combineLatest([
      this.projectsService.getProjects(),
      this.clientsService.getClients()
    ]).pipe(
      map(([projects, clients]) => {
        const activeProjectsCount = projects.filter(
          (p) => p.status === 'in_progress' || p.status === 'new'
        ).length;

        const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);

        return [
          {
            title: 'Активные проекты',
            value: activeProjectsCount,
            change: 'В работе и новые',
            icon: 'business_center',
            colorClass: 'primary'
          },
          {
            title: 'База клиентов',
            value: clients.length,
            change: 'Всего контрагентов',
            icon: 'people',
            colorClass: 'accent'
          },
          {
            title: 'Общий бюджет',
            value: `${totalBudget.toLocaleString('ru-RU')} ₽`,
            change: 'По всем проектам',
            icon: 'payments',
            colorClass: 'success'
          },
          {
            title: 'Всего проектов',
            value: projects.length,
            change: 'За всё время',
            icon: 'task_alt',
            colorClass: 'warn'
          }
        ];
      })
    );
  }

  // Фильтрация проектов, находящихся в работе
  getActiveProjects(): Observable<ActiveProject[]> {
    return this.projectsService.getProjects().pipe(
      map((projects) =>
        projects
          .filter((p) => p.status === 'in_progress' || p.status === 'new')
          .map((p) => ({
            id: p.id || '',
            title: p.title,
            client: p.clientName || 'Без клиента',
            progress: p.progress || 0,
            deadline: p.deadline || 'Без дедлайна'
          }))
      )
    );
  }
}