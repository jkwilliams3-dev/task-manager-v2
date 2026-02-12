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
  const { toggleTask, deleteTask, updateTask } = useTaskStore();
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
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
        },
      });
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast.success('Task deleted', {
      icon: '🗑️',
      style: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
      },
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

  const priorityColors: Record<Priority, string> = {
    low: 'border-l-green-500 bg-green-500/5',
    medium: 'border-l-yellow-500 bg-yellow-500/5',
    high: 'border-l-red-500 bg-red-500/5',
  };

  const priorityBadgeColors: Record<Priority, string> = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const isOverdue = task.dueDate && isPast(task.dueDate) && !task.completed;
  const isDueToday = task.dueDate && isToday(task.dueDate);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`glass rounded-xl border-l-4 ${priorityColors[task.priority]} ${
        isDragging ? 'opacity-50 scale-105 shadow-2xl' : ''
      } ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 transition-colors mt-1"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Checkbox */}
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-gray-600 hover:border-emerald-500'
          }`}
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
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-purple-500"
                autoFocus
              />
              <motion.button
                onClick={handleSaveEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Save className="w-4 h-4 text-white" />
              </motion.button>
              <motion.button
                onClick={handleCancelEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          ) : (
            <>
              <h4
                className={`text-white font-medium mb-1 ${
                  task.completed ? 'line-through opacity-60' : ''
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p className="text-sm text-gray-400 mb-2">{task.description}</p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* Priority Badge */}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    priorityBadgeColors[task.priority]
                  } flex items-center gap-1`}
                >
                  <Flag className="w-3 h-3" />
                  {task.priority}
                </span>

                {/* Due Date */}
                {task.dueDate && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                      isOverdue
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : isDueToday
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}
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
                    className="px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs"
                  >
                    {tag}
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleDelete}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
