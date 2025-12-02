import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EntryList } from './components/EntryList';
import { EntryForm } from './components/EntryForm';
import { Explore } from './components/Explore';
import { Database } from './pages/Database';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { useStore } from './store/useStore';
import { supabase } from './services/supabase';
import { Plus } from 'lucide-react';
import type { Entry } from './types/entry';
import { UpgradeModal } from './components/UpgradeModal';
import { PublicLayout } from './components/PublicLayout';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { CookieConsent } from './components/CookieConsent';
import { ScrollToTop } from './components/ScrollToTop';
import { Navigate } from 'react-router-dom';


function App() {
  const { loadEntries, user, setUser, theme, loadProfile } = useStore();
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
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadEntries();
        loadProfile(session.user.id);
      }
      // Ensure we stop loading once we get an auth event
      setIsAuthChecking(false);
    });

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && window.location.hash.includes('access_token')) {
        // If we have a hash but no session yet, let onAuthStateChange handle it
        return;
      }

      setUser(session?.user ?? null);
      if (session?.user) {
        loadEntries();
        loadProfile(session.user.id);
      }
      setIsAuthChecking(false);
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
        <Route path="/register" element={<Register />} />

        <Route
          path="*"
          element={
            user ? (
              <Layout onUpgrade={() => setIsUpgradeOpen(true)}>
                <div className="space-y-6">
                  {location.pathname === '/library' && (
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

                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <Routes>
                      <Route path="/" element={<Database />} />
                      <Route path="/dictionary/:dialect/:term" element={<Database />} />
                      <Route path="/library" element={<EntryList onEdit={handleEdit} />} />
                      <Route path="/explore" element={<Explore onEdit={handleEdit} />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsOfService />} />
                    </Routes>
                  </div>

                  {isFormOpen && (
                    <EntryForm
                      initialEntry={editingEntry}
                      onClose={handleCloseForm}
                    />
                  )}
                </div>
              </Layout>
            ) : (
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<Database />} />
                  <Route path="/dictionary/:dialect/:term" element={<Database />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PublicLayout>
            )
          }
        />
      </Routes>
      {isUpgradeOpen && <UpgradeModal onClose={() => setIsUpgradeOpen(false)} />}
      <CookieConsent />
      <ScrollToTop />
    </>
  );
}

export default App;
