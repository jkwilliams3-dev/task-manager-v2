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
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="glass p-3 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-purple-400" />
          )}
        </motion.button>
      </div>

      {/* Title */}
      <motion.h1
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-6xl font-bold mb-3 gradient-text"
      >
        TaskFlow Pro
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-gray-400 mb-6"
      >
        Your tasks, beautifully organized
      </motion.p>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem
            label="Total Tasks"
            value={stats.total}
            delay={0.4}
          />
          <StatItem
            label="Completed"
            value={stats.completed}
            delay={0.5}
            color="text-emerald-400"
          />
          <StatItem
            label="Active"
            value={stats.active}
            delay={0.6}
            color="text-purple-400"
          />
          <StatItem
            label="Completion"
            value={`${Math.round(stats.completionRate)}%`}
            delay={0.7}
            color="text-blue-400"
          />
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-full gradient-primary"
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
  color?: string;
}

const StatItem = ({ label, value, delay, color = 'text-white' }: StatItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="text-center"
    >
      <div className={`text-3xl font-bold ${color} mb-1`}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
        >
          {value}
        </motion.span>
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  );
};
