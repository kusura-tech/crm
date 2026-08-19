import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FinanceService } from '../../core/services/finance.service';
import { Payment } from '../../core/models/payment.interface';
import { PaymentDialogComponent } from '../../shared/components/payment-dialog/payment-dialog.component';

type PaymentTypeFilter = 'all' | Payment['type'];

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule
  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  private financeService = inject(FinanceService);
  private dialog = inject(MatDialog);

  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  displayedColumns: string[] = ['date', 'type', 'amount', 'status', 'description'];
  typeFilter: PaymentTypeFilter = 'all';

  totalIncome = 0;
  totalExpenses = 0;

  ngOnInit(): void {
    this.financeService.getPayments().subscribe((data) => {
      this.payments = data;
      this.applyFilter();
      this.calculateTotals();
    });
  }

  get netProfit(): number {
    return this.totalIncome - this.totalExpenses;
  }

  onTypeFilterChange(filter: PaymentTypeFilter): void {
    this.typeFilter = filter;
    this.applyFilter();
  }

  openAddPaymentDialog(): void {
    this.dialog
      .open(PaymentDialogComponent, {
        width: '560px',
        panelClass: 'custom-dialog-container'
      })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) {
          // Firestore stream обновит список автоматически
        }
      });
  }

  private applyFilter(): void {
    this.filteredPayments =
      this.typeFilter === 'all'
        ? this.payments
        : this.payments.filter((payment) => payment.type === this.typeFilter);
  }

  private calculateTotals(): void {
    this.totalIncome = this.payments
      .filter((payment) => payment.type === 'income' && payment.status === 'completed')
      .reduce((acc, payment) => acc + payment.amount, 0);

    this.totalExpenses = this.payments
      .filter((payment) => payment.type === 'expense' && payment.status === 'completed')
      .reduce((acc, payment) => acc + payment.amount, 0);
  }
}
