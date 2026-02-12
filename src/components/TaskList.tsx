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
  const { reorderTasks } = useTaskStore();
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
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6"
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
          />
        ))}
      </DndContext>
    </motion.div>
  );
};

interface CategorySectionProps {
  category: string;
  tasks: ReturnType<typeof useFilteredTasks>;
}

const CategorySection = ({ category, tasks }: CategorySectionProps) => {
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
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full glass rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[category] || '📁'}</span>
          <div className="text-left">
            <h3 className="font-semibold text-white">{category}</h3>
            <p className="text-sm text-gray-400">
              {activeTasks.length} active, {completedTasks.length} completed
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400"
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
            transition={{ duration: 0.3 }}
            className="space-y-2"
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
                  transition={{ delay: 0.2 }}
                  className="pt-3"
                >
                  <div className="text-sm text-gray-500 mb-2 px-2">
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

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-12 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Inbox className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-400 mb-2">
        No tasks found
      </h3>
      <p className="text-gray-500">
        Create your first task or adjust your filters
      </p>
    </motion.div>
  );
};
