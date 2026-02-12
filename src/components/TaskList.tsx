import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Inbox } from 'lucide-react';
import useTaskStore from '../store/taskStore';
import { useFilteredTasks } from '../store/taskStore';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const tasks = useFilteredTasks();
  const { reorderTasks, darkMode } = useTaskStore();
  const allTasks = useTaskStore((state) => state.tasks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = allTasks.findIndex((task) => task.id === active.id);
      const newIndex = allTasks.findIndex((task) => task.id === over.id);

      const newOrder = arrayMove(allTasks, oldIndex, newIndex);
      reorderTasks(newOrder);
    }
  };

  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const categories = Object.keys(tasksByCategory);

  if (tasks.length === 0) {
    return <EmptyState darkMode={darkMode} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="space-y-5"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {categories.map((category) => (
          <CategorySection
            key={category}
            category={category}
            tasks={tasksByCategory[category]}
            darkMode={darkMode}
          />
        ))}
      </DndContext>
    </motion.div>
  );
};

interface CategorySectionProps {
  category: string;
  tasks: ReturnType<typeof useFilteredTasks>;
  darkMode: boolean;
}

const CategorySection = ({ category, tasks, darkMode }: CategorySectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categoryIcons: Record<string, string> = {
    Work: '💼',
    Personal: '🏠',
    Shopping: '🛒',
    Health: '💪',
    Learning: '📚',
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-3">
      {/* Category Header */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className={`w-full rounded-lg p-4 flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          darkMode
            ? 'bg-slate-800 border border-slate-700 hover:bg-slate-750 shadow-sm'
            : 'bg-white border border-slate-300 hover:bg-slate-50 shadow-sm'
        }`}
        aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${category} category`}
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={category}>
            {categoryIcons[category] || '📁'}
          </span>
          <div className="text-left">
            <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {category}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {activeTasks.length} active, {completedTasks.length} completed
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ duration: 0.2 }}
          className={darkMode ? 'text-slate-400' : 'text-slate-600'}
          aria-hidden="true"
        >
          ▼
        </motion.div>
      </motion.button>

      {/* Tasks */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {/* Active Tasks */}
              {activeTasks.map((task, index) => (
                <TaskItem key={task.id} task={task} index={index} />
              ))}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="pt-2"
                >
                  <div className={`text-sm font-semibold mb-2 px-2 ${
                    darkMode ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    Completed ({completedTasks.length})
                  </div>
                  {completedTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      index={activeTasks.length + index}
                    />
                  ))}
                </motion.div>
              )}
            </SortableContext>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface EmptyStateProps {
  darkMode: boolean;
}

const EmptyState = ({ darkMode }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg p-16 text-center ${
        darkMode ? 'card-solid' : 'card-solid-light'
      }`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Inbox className={`w-20 h-20 mx-auto mb-4 ${
          darkMode ? 'text-slate-600' : 'text-slate-400'
        }`} />
      </motion.div>
      <h3 className={`text-2xl font-bold mb-2 ${
        darkMode ? 'text-slate-300' : 'text-slate-700'
      }`}>
        No tasks found
      </h3>
      <p className={`text-base ${
        darkMode ? 'text-slate-500' : 'text-slate-600'
      }`}>
        Create your first task or adjust your filters
      </p>
    </motion.div>
  );
};
