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
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#ffffff' : '#1f2937',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <TaskForm />
        <FilterBar />
        <TaskList />

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Built with React 18, TypeScript, Framer Motion, and Tailwind CSS
          </p>
          <p className="text-xs mt-2">
            Featuring glassmorphism, drag-and-drop, advanced filtering, and smooth animations
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
