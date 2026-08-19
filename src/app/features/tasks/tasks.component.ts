import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { switchMap } from 'rxjs';
import { Task } from '../../core/models/task.interface';
import { TasksService } from '../../core/services/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

interface Column {
  title: string;
  status: Task['status'];
  tasks: Task[];
}

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  private tasksService = inject(TasksService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  columns: Column[] = [
    { title: 'К выполнению', status: 'todo', tasks: [] },
    { title: 'В работе', status: 'in-progress', tasks: [] },
    { title: 'Тестирование', status: 'testing', tasks: [] },
    { title: 'Готово', status: 'done', tasks: [] }
  ];

  projectIdFilter: string | null = null;

  get connectedDropLists(): string[] {
    return this.columns.map((_, index) => `list-${index}`);
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          this.projectIdFilter = params.get('projectId');
          return this.tasksService.getTasks();
        })
      )
      .subscribe((tasks) => {
        const filtered = this.projectIdFilter
          ? tasks.filter((task) => task.projectId === this.projectIdFilter)
          : tasks;

        this.columns.forEach((col) => {
          col.tasks = filtered.filter((task) => task.status === col.status);
        });
      });
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: Task['status']): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const movedTask = event.previousContainer.data[event.previousIndex];
    if (!movedTask?.id) return;

    const previousStatus = movedTask.status;
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    movedTask.status = newStatus;

    this.tasksService.updateTaskStatus(movedTask.id, newStatus).catch((error) => {
      console.error('Не удалось обновить статус задачи:', error);
      transferArrayItem(
        event.container.data,
        event.previousContainer.data,
        event.currentIndex,
        event.previousIndex
      );
      movedTask.status = previousStatus;
    });
  }

  getPriorityLabel(priority: Task['priority']): string {
    switch (priority) {
      case 'low': return 'Низкий';
      case 'medium': return 'Средний';
      case 'high': return 'Высокий';
      default: return priority;
    }
  }

  getPriorityClass(priority: Task['priority']): string {
    return `priority-${priority}`;
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '460px',
      maxWidth: 'calc(100vw - 2rem)',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result: Task | undefined) => {
      if (result) {
        this.tasksService.addTask(result).catch((error) => {
          console.error('Не удалось добавить задачу:', error);
        });
      }
    });
  }
}
