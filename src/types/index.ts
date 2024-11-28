export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  completed: boolean;
  dueDate: string;
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    weekdays?: number[];
    monthDay?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: string | null;
}