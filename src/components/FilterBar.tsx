import { Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import useTaskStore from '../store/taskStore';
import type { FilterType, Priority } from '../types';

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Learning'];
const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' },
];

export const FilterBar = () => {
  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    darkMode,
  } = useTaskStore();

  const hasActiveFilters = selectedCategory || selectedPriority || searchQuery;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedPriority(null);
    setFilter('all');
  };

  const inputClasses = darkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="mb-6 space-y-4"
    >
      {/* Search and Status Filter */}
      <div className={`rounded-lg p-5 ${darkMode ? 'card-solid' : 'card-solid-light'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className={`w-full border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClasses}`}
              aria-label="Search tasks"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {FILTER_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setFilter(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-5 py-2.5 rounded-lg font-semibold transition-all border ${
                  filter === option.value
                    ? 'bg-primary-800 text-white border-transparent shadow-md'
                    : darkMode
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
                aria-label={`Filter: ${option.label}`}
                aria-pressed={filter === option.value}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`rounded-lg p-5 ${darkMode ? 'card-solid' : 'card-solid-light'}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
          <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Advanced Filters
          </span>
          {hasActiveFilters && (
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`ml-auto text-xs font-medium flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                darkMode
                  ? 'text-slate-400 hover:text-red-400 hover:bg-red-900/20'
                  : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
              }`}
              aria-label="Clear all filters"
            >
              <X className="w-3 h-3" />
              Clear All
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Filter by Category
            </label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClasses}`}
              aria-label="Filter by category"
            >
              <option value="" className={darkMode ? 'bg-slate-800' : 'bg-white'}>
                All Categories
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className={darkMode ? 'bg-slate-800' : 'bg-white'}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Filter by Priority
            </label>
            <select
              value={selectedPriority || ''}
              onChange={(e) => setSelectedPriority((e.target.value as Priority) || null)}
              className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClasses}`}
              aria-label="Filter by priority"
            >
              <option value="" className={darkMode ? 'bg-slate-800' : 'bg-white'}>
                All Priorities
              </option>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value} className={darkMode ? 'bg-slate-800' : 'bg-white'}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-wrap gap-2"
            role="list"
            aria-label="Active filters"
          >
            {searchQuery && (
              <FilterChip
                label={`Search: "${searchQuery}"`}
                onRemove={() => setSearchQuery('')}
                darkMode={darkMode}
              />
            )}
            {selectedCategory && (
              <FilterChip
                label={`Category: ${selectedCategory}`}
                onRemove={() => setSelectedCategory(null)}
                darkMode={darkMode}
              />
            )}
            {selectedPriority && (
              <FilterChip
                label={`Priority: ${selectedPriority}`}
                onRemove={() => setSelectedPriority(null)}
                darkMode={darkMode}
              />
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  darkMode: boolean;
}

const FilterChip = ({ label, onRemove, darkMode }: FilterChipProps) => {
  return (
    <motion.div
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
      {label}
      <button
        onClick={onRemove}
        className={`transition-colors font-bold text-base ${
          darkMode ? 'hover:text-red-400' : 'hover:text-red-600'
        }`}
        aria-label={`Remove filter: ${label}`}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
};
