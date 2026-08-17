import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { ClientsService } from '../../core/services/client.service';
import { Client } from '../../core/models/client.interface';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  private clientsService = inject(ClientsService);
  private fb = inject(FormBuilder);

  isModalOpen = false;
  editingClientId: string | null = null;
  
  searchControl = this.fb.control('');

  clientForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    notes: ['']
  });

  filteredClients$!: Observable<Client[]>;

  ngOnInit(): void {
    const clients$ = this.clientsService.getClients();
    const search$ = this.searchControl.valueChanges.pipe(startWith(''));

    // Фильтрация клиентов по имени, email или компании
    this.filteredClients$ = combineLatest([clients$, search$]).pipe(
      map(([clients, search]) => {
        const query = (search || '').toLowerCase().trim();
        if (!query) return clients;
        
        return clients.filter(c => 
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.company?.toLowerCase().includes(query)
        );
      })
    );
  }

  openModal(client?: Client): void {
    if (client && client.id) {
      this.editingClientId = client.id;
      this.clientForm.patchValue(client);
    } else {
      this.editingClientId = null;
      this.clientForm.reset();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingClientId = null;
    this.clientForm.reset();
  }

  saveClient(): void {
    if (this.clientForm.invalid) return;

    const formValue = this.clientForm.getRawValue();

    if (this.editingClientId) {
      this.clientsService.updateClient(this.editingClientId, formValue).then(() => {
        this.closeModal();
      });
    } else {
      this.clientsService.addClient(formValue).then(() => {
        this.closeModal();
      });
    }
  }

  deleteClient(id: string): void {
    if (confirm('Вы действительно хотите удалить этого клиента?')) {
      this.clientsService.deleteClient(id);
    }
  }
}