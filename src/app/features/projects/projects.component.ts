import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { ProjectsService } from '../../core/services/projects.service';
import { Project, ProjectStatus } from '../../core/models/project.interface';
import { Client } from '../../core/models/client.interface';
import { ClientsService } from '../../core/services/client.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private clientsService = inject(ClientsService);
  private fb = inject(FormBuilder);

  isModalOpen = false;
  editingProjectId: string | null = null;

  searchControl = this.fb.control('');
  statusFilterControl = this.fb.control<string>('all');

  clients$!: Observable<Client[]>;
  filteredProjects$!: Observable<Project[]>;

  projectForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    clientId: ['', Validators.required],
    clientName: [''],
    status: ['new' as ProjectStatus, Validators.required],
    budget: [0, [Validators.required, Validators.min(0)]],
    progress: [0, [Validators.min(0), Validators.max(100)]],
    deadline: ['']
  });

  statusLabels: Record<ProjectStatus, string> = {
    new: 'Новый',
    in_progress: 'В работе',
    on_hold: 'На паузе',
    completed: 'Завершён'
  };

  ngOnInit(): void {
    this.clients$ = this.clientsService.getClients();
    const projects$ = this.projectsService.getProjects();
    const search$ = this.searchControl.valueChanges.pipe(startWith(''));
    const status$ = this.statusFilterControl.valueChanges.pipe(startWith('all'));

    this.filteredProjects$ = combineLatest([projects$, search$, status$]).pipe(
      map(([projects, search, status]) => {
        const query = (search || '').toLowerCase().trim();
        return projects.filter((p) => {
          const matchesQuery =
            !query ||
            p.title.toLowerCase().includes(query) ||
            p.clientName?.toLowerCase().includes(query);
          const matchesStatus = status === 'all' || p.status === status;
          return matchesQuery && matchesStatus;
        });
      })
    );
  }

  onClientSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedOption = select.options[select.selectedIndex];
    this.projectForm.patchValue({ clientName: selectedOption.text });
  }

  openModal(project?: Project): void {
    if (project && project.id) {
      this.editingProjectId = project.id;
      this.projectForm.patchValue(project);
    } else {
      this.editingProjectId = null;
      this.projectForm.reset({
        status: 'new',
        budget: 0,
        progress: 0
      });
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingProjectId = null;
    this.projectForm.reset();
  }

  saveProject(): void {
    if (this.projectForm.invalid) return;

    const formValue = this.projectForm.getRawValue();

    if (this.editingProjectId) {
      this.projectsService.updateProject(this.editingProjectId, formValue).then(() => {
        this.closeModal();
      });
    } else {
      this.projectsService.addProject(formValue).then(() => {
        this.closeModal();
      });
    }
  }

  deleteProject(id: string): void {
    if (confirm('Вы действительно хотите удалить этот проект?')) {
      this.projectsService.deleteProject(id);
    }
  }
}