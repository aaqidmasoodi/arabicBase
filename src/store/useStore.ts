import { create } from 'zustand';
import type { Entry } from '../types/entry';
import { storage } from '../services/storage';
import { groqService } from '../services/groq';

interface AppState {
    newlyAddedEntryId: string | null;
    clearNewlyAddedEntryId: () => void;
    user: any | null;
    setUser: (user: any | null) => void;
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
    enrichEntry: (entry: Entry) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    newlyAddedEntryId: null,
    clearNewlyAddedEntryId: () => set({ newlyAddedEntryId: null }),
    user: null,
    setUser: (user) => set({ user }),
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
        set((state) => ({
            entries: [...state.entries, entry],
            newlyAddedEntryId: entry.id // Track the new entry ID
        }));

        // 2. Trigger background AI enrichment
        if (!entry.hasAiInsights) {
            groqService.generateAiInsights(entry.term, entry.notes, entry.dialect, entry.translation, entry.transliteration, entry.category, entry.type)
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
        // 1. Save the user's manual updates immediately
        await storage.saveEntry(updatedEntry);

        // Get the old entry to compare
        const oldEntry = get().entries.find(e => e.id === updatedEntry.id);

        set((state) => ({
            entries: state.entries.map((entry) =>
                entry.id === updatedEntry.id ? updatedEntry : entry
            ),
        }));

        // 2. Check if we need to regenerate AI insights
        // Regenerate if:
        // - No insights exist yet
        // - OR Core fields changed (Term, Translation, Dialect, Category, Type)
        const shouldRegenerate = !updatedEntry.hasAiInsights || (oldEntry && (
            oldEntry.term !== updatedEntry.term ||
            oldEntry.translation !== updatedEntry.translation ||
            oldEntry.dialect !== updatedEntry.dialect ||
            oldEntry.category !== updatedEntry.category ||
            oldEntry.type !== updatedEntry.type ||
            oldEntry.transliteration !== updatedEntry.transliteration
        ));

        if (shouldRegenerate) {
            console.log('Regenerating AI insights for updated entry:', updatedEntry.term);
            groqService.generateAiInsights(
                updatedEntry.term,
                updatedEntry.notes,
                updatedEntry.dialect,
                updatedEntry.translation,
                updatedEntry.transliteration,
                updatedEntry.category,
                updatedEntry.type
            )
                .then(async (jsonStr) => {
                    try {
                        const insights = JSON.parse(jsonStr);
                        const enrichedEntry: Entry = {
                            ...updatedEntry,
                            aiEnrichment: {
                                synonyms: insights.synonyms || [],
                                exampleUsage: insights.exampleUsage || '',
                                culturalContext: insights.culturalContext || '',
                                grammaticalNotes: insights.grammaticalNotes || '',
                            },
                            hasAiInsights: true,
                            updatedAt: Date.now(),
                        };

                        // Save and update store again with the AI data
                        await storage.saveEntry(enrichedEntry);
                        set((state) => ({
                            entries: state.entries.map((e) =>
                                e.id === enrichedEntry.id ? enrichedEntry : e
                            ),
                        }));
                    } catch (e) {
                        console.error('Failed to parse AI insights on update:', e);
                    }
                })
                .catch((err) => console.error('Background enrichment failed on update:', err));
        }
    },

    enrichEntry: async (entry) => {
        // Only enrich if not already enriched
        if (entry.hasAiInsights) return;

        console.log('Triggering on-demand AI enrichment for:', entry.term);

        groqService.generateAiInsights(
            entry.term,
            entry.notes,
            entry.dialect,
            entry.translation,
            entry.transliteration,
            entry.category,
            entry.type
        )
            .then(async (jsonStr) => {
                try {
                    const insights = JSON.parse(jsonStr);
                    const enrichedEntry: Entry = {
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

                    // Save and update store again with the AI data
                    await storage.saveEntry(enrichedEntry);
                    set((state) => ({
                        entries: state.entries.map((e) =>
                            e.id === enrichedEntry.id ? enrichedEntry : e
                        ),
                    }));
                } catch (e) {
                    console.error('Failed to parse AI insights on demand:', e);
                }
            })
            .catch((err) => console.error('On-demand enrichment failed:', err));
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
