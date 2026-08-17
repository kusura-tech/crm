export type ProjectStatus = 'new' | 'in_progress' | 'completed' | 'on_hold';

export interface Project {
  id?: string;
  userId: string;
  clientId: string;
  clientName?: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  budget: number;
  progress: number; // 0..100
  deadline?: string;
  createdAt: Date | any;
}

export interface ActiveProject {
  id: string;
  title: string;
  client: string;
  progress: number;
  deadline: string;
}