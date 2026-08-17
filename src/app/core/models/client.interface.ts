export interface Client {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: Date | any;
}