export interface Payment {
  id?: string;
  userId?: string;
  projectId: string;
  clientId: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  description?: string;
  createdAt?: Date | any;
}