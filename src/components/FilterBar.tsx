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
  } = useTaskStore();

  const hasActiveFilters = selectedCategory || selectedPriority || searchQuery;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedPriority(null);
    setFilter('all');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-6 space-y-4"
    >
      {/* Search and Status Filter */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {FILTER_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => setFilter(option.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === option.value
                    ? 'gradient-primary text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
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
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-400">Advanced Filters</span>
          {hasActiveFilters && (
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-auto text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear All
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Filter by Category</label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="" className="bg-gray-900">
                All Categories
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-gray-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Filter by Priority</label>
            <select
              value={selectedPriority || ''}
              onChange={(e) => setSelectedPriority((e.target.value as Priority) || null)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="" className="bg-gray-900">
                All Priorities
              </option>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value} className="bg-gray-900">
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
          >
            {searchQuery && (
              <FilterChip
                label={`Search: "${searchQuery}"`}
                onRemove={() => setSearchQuery('')}
              />
            )}
            {selectedCategory && (
              <FilterChip
                label={`Category: ${selectedCategory}`}
                onRemove={() => setSelectedCategory(null)}
              />
            )}
            {selectedPriority && (
              <FilterChip
                label={`Priority: ${selectedPriority}`}
                onRemove={() => setSelectedPriority(null)}
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
}

const FilterChip = ({ label, onRemove }: FilterChipProps) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300 flex items-center gap-2"
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:text-red-400 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
};
