export interface Task {
  id?: string;
  userId?: string;
  title: string;
  description?: string;
  projectId?: string;
  assignedTo?: string;
  status: 'todo' | 'in-progress' | 'testing' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt?: Date | any;
}