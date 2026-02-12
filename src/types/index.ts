export type Priority = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStore {
  tasks: Task[];
  filter: FilterType;
  searchQuery: string;
  selectedCategory: string | null;
  selectedPriority: Priority | null;
  darkMode: boolean;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedPriority: (priority: Priority | null) => void;
  toggleDarkMode: () => void;
  clearCompleted: () => void;
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
  byPriority: Record<Priority, number>;
  byCategory: Record<string, number>;
}
