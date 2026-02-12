import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskStore, Priority } from '../types';

const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      filter: 'all',
      searchQuery: '',
      selectedCategory: null,
      selectedPriority: null,
      darkMode: true, // Default to dark mode for modern feel

      addTask: (taskData) =>
        set((state) => {
          const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return { tasks: [newTask, ...state.tasks] };
        }),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date() }
              : task
          ),
        })),

      reorderTasks: (tasks) => set({ tasks }),

      setFilter: (filter) => set({ filter }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

      setSelectedPriority: (selectedPriority) => set({ selectedPriority }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        })),
    }),
    {
      name: 'task-manager-storage',
    }
  )
);

export default useTaskStore;

// Helper hook for filtered tasks
export const useFilteredTasks = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const filter = useTaskStore((state) => state.filter);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const selectedCategory = useTaskStore((state) => state.selectedCategory);
  const selectedPriority = useTaskStore((state) => state.selectedPriority);

  return tasks.filter((task) => {
    // Filter by status
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;

    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by category
    if (selectedCategory && task.category !== selectedCategory) return false;

    // Filter by priority
    if (selectedPriority && task.priority !== selectedPriority) return false;

    return true;
  });
};

// Helper hook for task statistics
export const useTaskStats = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  const byPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<Priority, number>);

  const byCategory = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return { total, completed, active, completionRate, byPriority, byCategory };
};
