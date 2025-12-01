import { create } from 'zustand';
import type { Entry } from '../types/entry';
import { storage } from '../services/storage';
import { groqService } from '../services/groq';

interface AppState {
    entries: Entry[];
    dialects: string[];
    categories: string[];
    isLoading: boolean;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    addDialect: (name: string) => Promise<void>;
    removeDialect: (name: string) => Promise<void>;
    addCategory: (name: string) => Promise<void>;
    removeCategory: (name: string) => Promise<void>;
    loadEntries: () => Promise<void>;
    addEntry: (entry: Entry) => Promise<void>;
    updateEntry: (entry: Entry) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    entries: [],
    dialects: [],
    categories: [],
    isLoading: false,
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

    toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        set({ theme: newTheme });
    },

    loadEntries: async () => {
        set({ isLoading: true });
        try {
            const [entries, dialects, categories] = await Promise.all([
                storage.getAllEntries(),
                storage.getDialects(),
                storage.getCategories()
            ]);

            // Only update dialects/categories if we got data back, otherwise keep defaults or handle empty
            set({
                entries,
                dialects: dialects.length > 0 ? dialects : get().dialects,
                categories: categories.length > 0 ? categories : get().categories
            });
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addEntry: async (entry) => {
        // 1. Save initial entry immediately
        await storage.saveEntry(entry);
        set((state) => ({ entries: [...state.entries, entry] }));

        // 2. Trigger background AI enrichment
        if (!entry.hasAiInsights) {
            groqService.generateAiInsights(entry.term, entry.notes)
                .then(async (jsonStr) => {
                    try {
                        const insights = JSON.parse(jsonStr);
                        const updatedEntry: Entry = {
                            ...entry,
                            aiEnrichment: {
                                synonyms: insights.synonyms || [],
                                exampleUsage: insights.exampleUsage || '',
                                culturalContext: insights.culturalContext || '',
                                grammaticalNotes: insights.grammaticalNotes || '',
                            },
                            hasAiInsights: true,
                            updatedAt: Date.now(),
                        };

                        // Update store and storage with enriched data
                        await storage.saveEntry(updatedEntry);
                        set((state) => ({
                            entries: state.entries.map((e) =>
                                e.id === entry.id ? updatedEntry : e
                            ),
                        }));
                    } catch (e) {
                        console.error('Failed to parse AI insights:', e);
                    }
                })
                .catch((err) => console.error('Background enrichment failed:', err));
        }
    },

    updateEntry: async (updatedEntry) => {
        await storage.saveEntry(updatedEntry);
        set((state) => ({
            entries: state.entries.map((entry) =>
                entry.id === updatedEntry.id ? updatedEntry : entry
            ),
        }));
    },

    deleteEntry: async (id) => {
        await storage.deleteEntry(id);
        set((state) => ({
            entries: state.entries.filter((entry) => entry.id !== id),
        }));
    },

    addDialect: async (name) => {
        await storage.addDialect(name);
        set((state) => ({ dialects: [...state.dialects, name] }));
    },

    removeDialect: async (name) => {
        // Cascade delete entries first
        await storage.deleteEntriesByDialect(name);
        await storage.removeDialect(name);

        set((state) => ({
            dialects: state.dialects.filter(d => d !== name),
            entries: state.entries.filter(e => e.dialect !== name)
        }));
    },

    addCategory: async (name) => {
        await storage.addCategory(name);
        set((state) => ({ categories: [...state.categories, name] }));
    },

    removeCategory: async (name) => {
        // Cascade delete entries first
        await storage.deleteEntriesByCategory(name);
        await storage.removeCategory(name);

        set((state) => ({
            categories: state.categories.filter(c => c !== name),
            entries: state.entries.filter(e => e.category !== name)
        }));
    },
}));
