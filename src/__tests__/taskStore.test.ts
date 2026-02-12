import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useTaskStore, { useFilteredTasks, useTaskStats } from '../store/taskStore';
import type { Task } from '../types';

describe('TaskStore', () => {
  beforeEach(() => {
    // Clear localStorage to prevent seed data from loading
    localStorage.clear();
    // Force store reset by accessing it fresh
    useTaskStore.setState({ tasks: [] });
  });

  describe('addTask', () => {
    it('should add a new task with generated id and timestamps', () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask({
          title: 'Test Task',
          description: 'Test Description',
          completed: false,
          priority: 'medium',
          category: 'Work',
          tags: ['test'],
        });
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0]).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        priority: 'medium',
        category: 'Work',
        tags: ['test'],
      });
      expect(result.current.tasks[0].id).toBeDefined();
      expect(result.current.tasks[0].createdAt).toBeInstanceOf(Date);
      expect(result.current.tasks[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should add task to the beginning of the list', () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask({
          title: 'First Task',
          completed: false,
          priority: 'low',
          category: 'Personal',
          tags: [],
        });
        result.current.addTask({
          title: 'Second Task',
          completed: false,
          priority: 'high',
          category: 'Work',
          tags: [],
        });
      });

      expect(result.current.tasks[0].title).toBe('Second Task');
      expect(result.current.tasks[1].title).toBe('First Task');
    });
  });

  describe('updateTask', () => {
    it('should update task properties', () => {
      const { result } = renderHook(() => useTaskStore());
     let taskId: string;

      act(() => {
        result.current.addTask({
          title: 'Original Title',
          completed: false,
          priority: 'low',
          category: 'Personal',
          tags: [],
        });
      });

      // Get the task ID from the updated store
      taskId = useTaskStore.getState().tasks[0].id;

      act(() => {
        result.current.updateTask(taskId, {
          title: 'Updated Title',
          priority: 'high',
        });
      });

      const updatedTask = useTaskStore.getState().tasks[0];
      expect(updatedTask.title).toBe('Updated Title');
      expect(updatedTask.priority).toBe('high');
    });

    it('should update updatedAt timestamp', async () => {
      const { result } = renderHook(() => useTaskStore());
      let taskId: string;
      let originalUpdatedAt: Date;

      act(() => {
        result.current.addTask({
          title: 'Test Task',
          completed: false,
          priority: 'low',
          category: 'Work',
          tags: [],
        });
      });

      taskId = useTaskStore.getState().tasks[0].id;
      originalUpdatedAt = useTaskStore.getState().tasks[0].updatedAt;

      // Small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      act(() => {
        result.current.updateTask(taskId, { title: 'New Title' });
      });

      const updatedTask = useTaskStore.getState().tasks[0];
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('deleteTask', () => {
    it('should remove task from list', () => {
      const { result } = renderHook(() => useTaskStore());
      let taskId: string;

      act(() => {
        result.current.addTask({
          title: 'Task to Delete',
          completed: false,
          priority: 'low',
          category: 'Personal',
          tags: [],
        });
      });

      taskId = useTaskStore.getState().tasks[0].id;
      expect(useTaskStore.getState().tasks).toHaveLength(1);

      act(() => {
        result.current.deleteTask(taskId);
      });

      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });

    it('should not affect other tasks', () => {
      const { result } = renderHook(() => useTaskStore());
      let taskToDeleteId: string;

      act(() => {
        result.current.addTask({
          title: 'Keep This',
          completed: false,
          priority: 'low',
          category: 'Personal',
          tags: [],
        });
        result.current.addTask({
          title: 'Delete This',
          completed: false,
          priority: 'low',
          category: 'Personal',
          tags: [],
        });
      });

      taskToDeleteId = useTaskStore.getState().tasks[0].id;

      act(() => {
        result.current.deleteTask(taskToDeleteId);
      });

      const remainingTasks = useTaskStore.getState().tasks;
      expect(remainingTasks).toHaveLength(1);
      expect(remainingTasks[0].title).toBe('Keep This');
    });
  });

  describe('toggleTask', () => {
    it('should toggle completed status', () => {
      const { result } = renderHook(() => useTaskStore());
      let taskId: string;

      act(() => {
        result.current.addTask({
          title: 'Toggle Me',
          completed: false,
          priority: 'low',
          category: 'Personal',
          tags: [],
        });
      });

      taskId = useTaskStore.getState().tasks[0].id;
      expect(useTaskStore.getState().tasks[0].completed).toBe(false);

      act(() => {
        result.current.toggleTask(taskId);
      });

      expect(useTaskStore.getState().tasks[0].completed).toBe(true);

      act(() => {
        result.current.toggleTask(taskId);
      });

      expect(useTaskStore.getState().tasks[0].completed).toBe(false);
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed tasks', () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.addTask({
          title: 'Active Task',
          completed: false,
          priority: 'low',
          category: 'Personal',
          tags: [],
        });
        result.current.addTask({
          title: 'Completed Task 1',
          completed: true,
          priority: 'low',
          category: 'Personal',
          tags: [],
        });
        result.current.addTask({
          title: 'Completed Task 2',
          completed: true,
          priority: 'low',
          category: 'Personal',
          tags: [],
        });
      });

      expect(result.current.tasks).toHaveLength(3);

      act(() => {
        result.current.clearCompleted();
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe('Active Task');
    });
  });

  describe('filters', () => {
    it('should set filter', () => {
      const { result } = renderHook(() => useTaskStore());

      expect(result.current.filter).toBe('all');

      act(() => {
        result.current.setFilter('active');
      });

      expect(result.current.filter).toBe('active');
    });

    it('should set search query', () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setSearchQuery('test query');
      });

      expect(result.current.searchQuery).toBe('test query');
    });

    it('should set category filter', () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setSelectedCategory('Work');
      });

      expect(result.current.selectedCategory).toBe('Work');
    });

    it('should set priority filter', () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setSelectedPriority('high');
      });

      expect(result.current.selectedPriority).toBe('high');
    });
  });

  describe('darkMode', () => {
    it('should toggle dark mode', () => {
      const { result } = renderHook(() => useTaskStore());
      const initialDarkMode = result.current.darkMode;

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(!initialDarkMode);
    });
  });
});

describe('useFilteredTasks', () => {
  beforeEach(() => {
    localStorage.clear();
    useTaskStore.setState({ 
      tasks: [],
      filter: 'all',
      searchQuery: '',
      selectedCategory: null,
      selectedPriority: null
    });
  });

  it('should filter by status (active)', () => {
    // Create the hook first so it subscribes to changes
    const { result, rerender } = renderHook(() => useFilteredTasks());

    // Add tasks directly to store
    act(() => {
      useTaskStore.getState().addTask({
        title: 'Active Task',
        completed: false,
        priority: 'low',
        category: 'Personal',
        tags: [],
      });
      useTaskStore.getState().addTask({
        title: 'Completed Task',
        completed: true,
        priority: 'low',
        category: 'Personal',
        tags: [],
      });
      useTaskStore.getState().setFilter('active');
    });

    // Rerender to get updated results
    rerender();

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Active Task');
  });

  it('should filter by status (completed)', () => {
    const { result, rerender } = renderHook(() => useFilteredTasks());

    act(() => {
      useTaskStore.getState().addTask({
        title: 'Active Task',
        completed: false,
        priority: 'low',
        category: 'Personal',
        tags: [],
      });
      useTaskStore.getState().addTask({
        title: 'Completed Task',
        completed: true,
        priority: 'low',
        category: 'Personal',
        tags: [],
      });
      useTaskStore.getState().setFilter('completed');
    });

    rerender();
    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Completed Task');
  });

  it('should filter by search query (title)', () => {
    const { result, rerender } = renderHook(() => useFilteredTasks());

    act(() => {
      useTaskStore.getState().addTask({
        title: 'Meeting with client',
        completed: false,
        priority: 'low',
        category: 'Work',
        tags: [],
      });
      useTaskStore.getState().addTask({
        title: 'Buy groceries',
        completed: false,
        priority: 'low',
        category: 'Shopping',
        tags: [],
      });
      useTaskStore.getState().setSearchQuery('meeting');
    });

    rerender();
    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Meeting with client');
  });

  it('should filter by search query (tags)', () => {
    const { result, rerender } = renderHook(() => useFilteredTasks());

    act(() => {
      useTaskStore.getState().addTask({
        title: 'Task 1',
        completed: false,
        priority: 'low',
        category: 'Work',
        tags: ['urgent', 'client'],
      });
      useTaskStore.getState().addTask({
        title: 'Task 2',
        completed: false,
        priority: 'low',
        category: 'Personal',
        tags: ['personal'],
      });
      useTaskStore.getState().setSearchQuery('urgent');
    });

    rerender();
    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Task 1');
  });

  it('should filter by category', () => {
    const { result, rerender } = renderHook(() => useFilteredTasks());

    act(() => {
      useTaskStore.getState().addTask({
        title: 'Work Task',
        completed: false,
        priority: 'low',
        category: 'Work',
        tags: [],
      });
      useTaskStore.getState().addTask({
        title: 'Personal Task',
        completed: false,
        priority: 'low',
        category: 'Personal',
        tags: [],
      });
      useTaskStore.getState().setSelectedCategory('Work');
    });

    rerender();
    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Work Task');
  });

  it('should filter by priority', () => {
    const { result, rerender } = renderHook(() => useFilteredTasks());

    act(() => {
      useTaskStore.getState().addTask({
        title: 'High Priority Task',
        completed: false,
        priority: 'high',
        category: 'Work',
        tags: [],
      });
      useTaskStore.getState().addTask({
        title: 'Low Priority Task',
        completed: false,
        priority: 'low',
        category: 'Work',
        tags: [],
      });
      useTaskStore.getState().setSelectedPriority('high');
    });

    rerender();
    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('High Priority Task');
  });

  it('should apply multiple filters', () => {
    const { result, rerender } = renderHook(() => useFilteredTasks());

    act(() => {
      useTaskStore.getState().addTask({
        title: 'Active Work Task',
        completed: false,
        priority: 'high',
        category: 'Work',
        tags: [],
      });
      useTaskStore.getState().addTask({
        title: 'Completed Work Task',
        completed: true,
        priority: 'high',
        category: 'Work',
        tags: [],
      });
      useTaskStore.getState().addTask({
        title: 'Active Personal Task',
        completed: false,
        priority: 'low',
        category: 'Personal',
        tags: [],
      });
      useTaskStore.getState().setFilter('active');
      useTaskStore.getState().setSelectedCategory('Work');
      useTaskStore.getState().setSelectedPriority('high');
    });

    rerender();
    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Active Work Task');
  });
});

describe('useTaskStats', () => {
  beforeEach(() => {
    localStorage.clear();
    useTaskStore.setState({ tasks: [] });
  });

  it('should calculate correct statistics', () => {
    const { result: storeResult } = renderHook(() => useTaskStore());

    act(() => {
      storeResult.current.addTask({
        title: 'Task 1',
        completed: true,
        priority: 'high',
        category: 'Work',
        tags: [],
      });
      storeResult.current.addTask({
        title: 'Task 2',
        completed: false,
        priority: 'high',
        category: 'Work',
        tags: [],
      });
      storeResult.current.addTask({
        title: 'Task 3',
        completed: false,
        priority: 'low',
        category: 'Personal',
        tags: [],
      });
    });

    const { result: statsResult } = renderHook(() => useTaskStats());

    expect(statsResult.current.total).toBe(3);
    expect(statsResult.current.completed).toBe(1);
    expect(statsResult.current.active).toBe(2);
    expect(statsResult.current.completionRate).toBeCloseTo(33.33, 1);
    expect(statsResult.current.byPriority.high).toBe(2);
    expect(statsResult.current.byPriority.low).toBe(1);
    expect(statsResult.current.byCategory.Work).toBe(2);
    expect(statsResult.current.byCategory.Personal).toBe(1);
  });

  it('should handle empty task list', () => {
    const { result: statsResult } = renderHook(() => useTaskStats());

    expect(statsResult.current.total).toBe(0);
    expect(statsResult.current.completed).toBe(0);
    expect(statsResult.current.active).toBe(0);
    expect(statsResult.current.completionRate).toBe(0);
  });
});
