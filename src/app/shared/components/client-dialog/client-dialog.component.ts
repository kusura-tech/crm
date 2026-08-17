import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../../../core/models/client.interface';
import { ClientsService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './client-dialog.component.html',
  styleUrls: ['./client-dialog.component.scss']
})
export class ClientDialogComponent {
  private fb = inject(FormBuilder);
  private clientsService = inject(ClientsService);
  private dialogRef = inject(MatDialogRef<ClientDialogComponent>);

  clientForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    notes: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { client?: Client }) {
    if (this.data?.client) {
      this.clientForm.patchValue(this.data.client);
    }
  }

  save(): void {
    if (this.clientForm.invalid) return;

    const formValue = this.clientForm.getRawValue();

    if (this.data?.client?.id) {
      this.clientsService.updateClient(this.data.client.id, formValue).then(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.clientsService.addClient(formValue).then(() => {
        this.dialogRef.close(true);
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}