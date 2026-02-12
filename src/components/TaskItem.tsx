import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  Flag,
  GripVertical,
  X,
  Save,
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import toast from 'react-hot-toast';
import useTaskStore from '../store/taskStore';
import type { Task, Priority } from '../types';

interface TaskItemProps {
  task: Task;
  index: number;
}

export const TaskItem = ({ task, index }: TaskItemProps) => {
  const { toggleTask, deleteTask, updateTask, darkMode } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = () => {
    toggleTask(task.id);
    if (!task.completed) {
      toast.success('Task completed! 🎉', {
        icon: '✅',
      });
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast.success('Task deleted', {
      icon: '🗑️',
    });
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      updateTask(task.id, { title: editedTitle.trim() });
      setIsEditing(false);
      toast.success('Task updated');
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const priorityBorderColors: Record<Priority, string> = {
    low: 'border-l-emerald-500',
    medium: 'border-l-amber-500',
    high: 'border-l-red-500',
  };

  const priorityBgColors: Record<Priority, string> = darkMode ? {
    low: 'bg-emerald-900/30',
    medium: 'bg-amber-900/30',
    high: 'bg-red-900/30',
  } : {
    low: 'bg-emerald-50',
    medium: 'bg-amber-50',
    high: 'bg-red-50',
  };

  const priorityBadgeColors: Record<Priority, string> = darkMode ? {
    low: 'bg-emerald-600 text-white border-emerald-700',
    medium: 'bg-amber-600 text-white border-amber-700',
    high: 'bg-red-600 text-white border-red-700',
  } : {
    low: 'bg-emerald-500 text-white border-emerald-600',
    medium: 'bg-amber-500 text-white border-amber-600',
    high: 'bg-red-500 text-white border-red-600',
  };

  const isOverdue = task.dueDate && isPast(task.dueDate) && !task.completed;
  const isDueToday = task.dueDate && isToday(task.dueDate);

  const cardClasses = darkMode
    ? 'bg-slate-800 border border-slate-700'
    : 'bg-white border border-slate-300';

  const textPrimaryClasses = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondaryClasses = darkMode ? 'text-slate-400' : 'text-slate-600';
  const textMutedClasses = darkMode ? 'text-slate-500' : 'text-slate-500';

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={`rounded-lg border-l-4 ${priorityBorderColors[task.priority]} ${priorityBgColors[task.priority]} ${cardClasses} ${
        isDragging ? 'opacity-50 scale-[1.02] shadow-xl' : 'shadow-sm'
      } ${task.completed ? 'opacity-70' : ''}`}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing ${textMutedClasses} hover:${textSecondaryClasses} transition-colors mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
          aria-label="Drag to reorder task"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Checkbox */}
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-600'
              : darkMode
                ? 'border-slate-600 hover:border-emerald-500'
                : 'border-slate-400 hover:border-emerald-500'
          }`}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          aria-checked={task.completed}
          role="checkbox"
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                className={`flex-1 border-2 rounded-lg px-3 py-2 ${textPrimaryClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? 'bg-slate-900 border-slate-600'
                    : 'bg-white border-slate-300'
                }`}
                autoFocus
                aria-label="Edit task title"
              />
              <motion.button
                onClick={handleSaveEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Save changes"
              >
                <Save className="w-4 h-4 text-white" />
              </motion.button>
              <motion.button
                onClick={handleCancelEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4 ${textPrimaryClasses}" />
              </motion.button>
            </div>
          ) : (
            <>
              <h4
                className={`${textPrimaryClasses} font-semibold text-base mb-1 ${
                  task.completed ? 'line-through opacity-60' : ''
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p className={`text-sm ${textSecondaryClasses} mb-2 ${
                  task.completed ? 'line-through opacity-60' : ''
                }`}>
                  {task.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {/* Priority Badge */}
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                    priorityBadgeColors[task.priority]
                  } flex items-center gap-1.5`}
                  aria-label={`Priority: ${task.priority}`}
                >
                  <Flag className="w-3 h-3" />
                  {task.priority.toUpperCase()}
                </span>

                {/* Category Badge */}
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    darkMode
                      ? 'bg-blue-900 text-blue-200 border border-blue-700'
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                  }`}
                  aria-label={`Category: ${task.category}`}
                >
                  {task.category}
                </span>

                {/* Due Date */}
                {task.dueDate && (
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${
                      isOverdue
                        ? darkMode
                          ? 'bg-red-900 text-red-200 border-red-700'
                          : 'bg-red-100 text-red-700 border-red-300'
                        : isDueToday
                        ? darkMode
                          ? 'bg-cyan-900 text-cyan-200 border-cyan-700'
                          : 'bg-cyan-100 text-cyan-700 border-cyan-300'
                        : darkMode
                        ? 'bg-slate-700 text-slate-300 border-slate-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                    aria-label={`Due date: ${format(task.dueDate, 'MMM d, yyyy')}`}
                  >
                    <Calendar className="w-3 h-3" />
                    {format(task.dueDate, 'MMM d')}
                    {isOverdue && ' (Overdue)'}
                    {isDueToday && ' (Today)'}
                  </span>
                )}

                {/* Tags */}
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                      darkMode
                        ? 'bg-indigo-900/50 text-indigo-200 border-indigo-700'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                    }`}
                    aria-label={`Tag: ${tag}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex gap-1 flex-shrink-0">
            <motion.button
              onClick={() => setIsEditing(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? 'text-slate-400 hover:text-blue-300 hover:bg-blue-900/30'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
              aria-label="Edit task"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                darkMode
                  ? 'text-slate-400 hover:text-red-300 hover:bg-red-900/30'
                  : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
              }`}
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
