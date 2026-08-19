import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactMessage } from '../../../core/models/lead.interface';
import { LeadsService } from '../../../core/services/leads.service';

@Component({
  selector: 'app-leads-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss']
})
export class LeadsListComponent implements OnInit {
  private leadsService = inject(LeadsService);
  private snackBar = inject(MatSnackBar);

  leads: ContactMessage[] = [];
  displayedColumns: string[] = ['name', 'contacts', 'serviceType', 'message', 'status', 'actions'];
  convertingLeadId: string | null = null;

  ngOnInit(): void {
    this.leadsService.getLeads().subscribe((data) => {
      this.leads = data;
    });
  }

  getStatusColor(status: ContactMessage['status']): string {
    switch (status) {
      case 'new': return 'accent';
      case 'archived': return 'primary';
      case 'converted': return 'warn';
      default: return '';
    }
  }

  canConvert(lead: ContactMessage): boolean {
    return lead.status !== 'converted' && lead.status !== 'archived';
  }

  async convertToClient(lead: ContactMessage): Promise<void> {
    if (!lead.id || !this.canConvert(lead)) return;

    this.convertingLeadId = lead.id;

    try {
      await this.leadsService.convertToClient(lead);
      this.snackBar.open(`Клиент «${lead.name}» успешно создан`, 'Закрыть', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } catch {
      this.snackBar.open('Не удалось преобразовать заявку в клиента', 'Закрыть', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snack-error']
      });
    } finally {
      this.convertingLeadId = null;
    }
  }
}
