import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EntryList } from './components/EntryList';
import { EntryForm } from './components/EntryForm';
import { Explore } from './components/Explore';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { useStore } from './store/useStore';
import { supabase } from './services/supabase';
import { Plus } from 'lucide-react';
import type { Entry } from './types/entry';
import { UpgradeModal } from './components/UpgradeModal';

function App() {
  const { loadEntries, isLoading, user, setUser, theme, loadProfile } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | undefined>(undefined);
  const location = useLocation();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Global Theme Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthChecking(false);
      if (session?.user) {
        loadEntries();
        loadProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadEntries();
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, loadEntries, loadProfile]);

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(undefined);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="*"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <Layout onUpgrade={() => setIsUpgradeOpen(true)}>
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
            )
          }
        />
      </Routes>
      {isUpgradeOpen && <UpgradeModal onClose={() => setIsUpgradeOpen(false)} />}
    </>
  );
}

export default App;
