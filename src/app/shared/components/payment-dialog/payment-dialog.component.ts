import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Payment } from '../../../core/models/payment.interface';
import { FinanceService } from '../../../core/services/finance.service';
import { ClientsService } from '../../../core/services/client.service';
import { ProjectsService } from '../../../core/services/projects.service';
import { Client } from '../../../core/models/client.interface';
import { Project } from '../../../core/models/project.interface';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent {
  private fb = inject(FormBuilder);
  private financeService = inject(FinanceService);
  private clientsService = inject(ClientsService);
  private projectsService = inject(ProjectsService);
  private dialogRef = inject(MatDialogRef<PaymentDialogComponent>);

  clients$: Observable<Client[]> = this.clientsService.getClients();
  projects$: Observable<Project[]> = this.projectsService.getProjects();
  isSaving = false;

  paymentForm = this.fb.nonNullable.group({
    type: ['income' as Payment['type'], Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    description: [''],
    date: [this.formatDateForInput(new Date()), Validators.required],
    status: ['completed' as Payment['status'], Validators.required],
    projectId: [''],
    clientId: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { defaultType?: Payment['type'] }) {
    if (data?.defaultType) {
      this.paymentForm.patchValue({ type: data.defaultType });
    }
  }

  save(): void {
    if (this.paymentForm.invalid || this.isSaving) return;

    const formValue = this.paymentForm.getRawValue();
    this.isSaving = true;

    this.financeService
      .addPayment({
        type: formValue.type,
        amount: formValue.amount,
        description: formValue.description || undefined,
        date: new Date(formValue.date),
        status: formValue.status,
        projectId: formValue.projectId || '',
        clientId: formValue.clientId || ''
      })
      .then(() => this.dialogRef.close(true))
      .catch((error) => {
        console.error('Ошибка при добавлении платежа:', error);
        this.isSaving = false;
      });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
