export interface Lead {
  id: string;
  name: string;
  service: string;
  date: string;
  status: 'new' | 'in_review';
}