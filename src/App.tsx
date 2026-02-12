import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { FilterBar } from './components/FilterBar';
import { TaskList } from './components/TaskList';
import useTaskStore from './store/taskStore';

function App() {
  const darkMode = useTaskStore((state) => state.darkMode);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? 'bg-slate-900'
          : 'bg-slate-100'
      }`}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#1e293b' : '#ffffff',
            color: darkMode ? '#ffffff' : '#1e293b',
            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <TaskForm />
        <FilterBar />
        <TaskList />

        {/* Footer */}
        <footer className={`text-center mt-12 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <p className="text-sm font-medium">
            Built with React 19, TypeScript, Framer Motion, and Tailwind CSS
          </p>
          <p className="text-xs mt-2">
            Professional task management with drag-and-drop, advanced filtering, and 508 compliance
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
