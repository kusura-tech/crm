import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ProjectsService } from '../../../core/services/projects.service';
import { Project, ProjectStatus } from '../../../core/models/project.interface';
import { Client } from '../../../core/models/client.interface';
import { ClientsService } from '../../../core/services/client.service';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);
  private clientsService = inject(ClientsService);
  private dialogRef = inject(MatDialogRef<ProjectDialogComponent>);

  clients$!: Observable<Client[]>;

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: { project?: Project }) {}

  ngOnInit(): void {
    this.clients$ = this.clientsService.getClients();

    if (this.data?.project) {
      this.projectForm.patchValue(this.data.project);
    }
  }

  onClientSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedOption = select.options[select.selectedIndex];
    this.projectForm.patchValue({ clientName: selectedOption.text });
  }

  save(): void {
    if (this.projectForm.invalid) return;

    const formValue = this.projectForm.getRawValue();

    if (this.data?.project?.id) {
      this.projectsService.updateProject(this.data.project.id, formValue).then(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.projectsService.addProject(formValue).then(() => {
        this.dialogRef.close(true);
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}