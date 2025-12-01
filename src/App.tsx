import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EntryList } from './components/EntryList';
import { EntryForm } from './components/EntryForm';
import { Explore } from './components/Explore';
import { Settings } from './components/Settings';
import { useStore } from './store/useStore';
import { Plus } from 'lucide-react';
import type { Entry } from './types/entry';

function App() {
  const { loadEntries, isLoading } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(undefined);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {location.pathname === '/' && (
          <div className="flex justify-between items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">My Knowledge Base</h2>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add Entry
            </button>
          </div>
        )}

        {location.pathname === '/explore' && (
          <div className="flex justify-between items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Explore Entries</h2>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <Routes>
              <Route path="/" element={<EntryList onEdit={handleEdit} />} />
              <Route path="/explore" element={<Explore onEdit={handleEdit} />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        )}

        {isFormOpen && (
          <EntryForm
            initialEntry={editingEntry}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;
