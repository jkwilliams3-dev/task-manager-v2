import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import useTaskStore, { useTaskStats } from '../store/taskStore';

export const Header = () => {
  const { darkMode, toggleDarkMode } = useTaskStore();
  const stats = useTaskStats();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center mb-8"
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className={`p-3 rounded-lg transition-colors ${
            darkMode
              ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
              : 'bg-white hover:bg-slate-50 border border-slate-300 shadow-sm'
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </motion.button>
      </div>

      {/* Title */}
      <motion.h1
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`text-5xl font-bold mb-3 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}
      >
        TaskFlow Pro
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`text-lg mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
      >
        Professional Task Management System
      </motion.p>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className={`rounded-lg p-8 max-w-3xl mx-auto ${
          darkMode ? 'card-solid' : 'card-solid-light'
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem
            label="Total Tasks"
            value={stats.total}
            delay={0.3}
            darkMode={darkMode}
          />
          <StatItem
            label="Completed"
            value={stats.completed}
            delay={0.35}
            color={darkMode ? 'text-emerald-400' : 'text-emerald-600'}
            darkMode={darkMode}
          />
          <StatItem
            label="Active"
            value={stats.active}
            delay={0.4}
            color={darkMode ? 'text-blue-400' : 'text-blue-600'}
            darkMode={darkMode}
          />
          <StatItem
            label="Completion"
            value={`${Math.round(stats.completionRate)}%`}
            delay={0.45}
            color={darkMode ? 'text-cyan-400' : 'text-cyan-600'}
            darkMode={darkMode}
          />
        </div>

        {/* Progress Bar */}
        <div className={`mt-6 rounded-full h-3 overflow-hidden ${
          darkMode ? 'bg-slate-800' : 'bg-slate-200'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-full bg-primary-800"
          />
        </div>
      </motion.div>
    </motion.header>
  );
};

interface StatItemProps {
  label: string;
  value: string | number;
  delay: number;
  darkMode: boolean;
  color?: string;
}

const StatItem = ({ label, value, delay, darkMode, color }: StatItemProps) => {
  const defaultColor = darkMode ? 'text-white' : 'text-slate-900';
  const labelColor = darkMode ? 'text-slate-400' : 'text-slate-600';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="text-center"
    >
      <div className={`text-4xl font-bold ${color || defaultColor} mb-2`}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.05 }}
        >
          {value}
        </motion.span>
      </div>
      <div className={`text-sm font-medium ${labelColor}`}>{label}</div>
    </motion.div>
  );
};
