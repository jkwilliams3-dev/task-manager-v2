import { useState } from 'react';
import { Plus, Calendar, Tag, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import useTaskStore from '../store/taskStore';
import type { Priority } from '../types';

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Learning'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export const TaskForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { addTask, darkMode } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Personal');
    setPriority('medium');
    setDueDate('');
    setTags([]);
    setTagInput('');
    setIsExpanded(false);

    toast.success('Task added successfully!', {
      icon: '✅',
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const priorityColors = {
    low: darkMode 
      ? 'bg-emerald-700 hover:bg-emerald-800 text-white' 
      : 'bg-emerald-700 hover:bg-emerald-800 text-white',
    medium: darkMode 
      ? 'bg-amber-700 hover:bg-amber-800 text-white' 
      : 'bg-amber-700 hover:bg-amber-800 text-white',
    high: darkMode 
      ? 'bg-red-600 hover:bg-red-700 text-white' 
      : 'bg-red-600 hover:bg-red-700 text-white',
  };

  const inputClasses = darkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mb-8"
    >
      <form 
        onSubmit={handleSubmit} 
        className={`rounded-lg p-6 space-y-4 ${darkMode ? 'card-solid' : 'card-solid-light'}`}
        aria-label="Add new task form"
      >
        {/* Main Input */}
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="What needs to be done?"
            className={`w-full bg-transparent border-none text-lg ${
              darkMode ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'
            } focus:outline-none pr-14`}
            aria-label="Task title"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary-800 hover:bg-primary-700 p-2.5 rounded-lg transition-colors border border-transparent"
            aria-label="Add task"
          >
            <Plus className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Expanded Fields */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden space-y-4"
        >
          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (optional)"
            rows={2}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${inputClasses}`}
            aria-label="Task description"
          />

          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <label className={`flex items-center text-sm font-medium ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Tag className="w-4 h-4 mr-2" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClasses}`}
                aria-label="Task category"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className={darkMode ? 'bg-slate-800' : 'bg-white'}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className={`flex items-center text-sm font-medium ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Calendar className="w-4 h-4 mr-2" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClasses}`}
                aria-label="Task due date"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className={`flex items-center text-sm font-medium ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Flag className="w-4 h-4 mr-2" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRIORITIES.map((p) => (
                <motion.button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`py-2.5 rounded-lg font-semibold capitalize transition-all border-2 ${
                    priority === p
                      ? priorityColors[p] + ' border-transparent shadow-md'
                      : darkMode
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                  aria-label={`Set priority to ${p}`}
                  aria-pressed={priority === p}
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${
              darkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2" role="list" aria-label="Task tags">
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${
                    darkMode 
                      ? 'bg-blue-900/50 border border-blue-700 text-blue-200'
                      : 'bg-blue-50 border border-blue-300 text-blue-700'
                  }`}
                  role="listitem"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className={`hover:text-red-500 transition-colors font-bold text-lg leading-none ${
                      darkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter"
                className={`flex-1 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClasses}`}
                aria-label="New tag input"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <motion.button
              type="button"
              onClick={() => setIsExpanded(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'text-slate-300 hover:bg-slate-800 border border-slate-700'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
              aria-label="Cancel adding task"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-primary-800 hover:bg-primary-700 rounded-lg font-semibold text-white shadow-md transition-colors"
              aria-label="Submit new task"
            >
              Add Task
            </motion.button>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};
