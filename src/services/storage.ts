import { supabase } from './supabase';
import type { Entry } from '../types/entry';

export const storage = {
    async getAllEntries(): Promise<Entry[]> {
        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching entries:', error);
            return [];
        }

        return data.map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.created_at).getTime(),
            updatedAt: new Date(entry.updated_at).getTime(),
            aiEnrichment: entry.ai_enrichment,
            hasAiInsights: entry.has_ai_insights
        })) as Entry[];
    },

    async saveEntry(entry: Entry): Promise<void> {
        const { error } = await supabase
            .from('entries')
            .upsert({
                id: entry.id,
                term: entry.term,
                transliteration: entry.transliteration,
                translation: entry.translation,
                dialect: entry.dialect,
                category: entry.category,
                type: entry.type,
                tags: entry.tags,
                notes: entry.notes,
                has_ai_insights: entry.hasAiInsights,
                ai_enrichment: entry.aiEnrichment,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error saving entry:', error);
            throw error;
        }
    },

    async deleteEntry(id: string): Promise<void> {
        const { error } = await supabase
            .from('entries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting entry:', error);
            throw error;
        }
    },

    async deleteEntriesByDialect(dialect: string): Promise<void> {
        const { error } = await supabase
            .from('entries')
            .delete()
            .eq('dialect', dialect);

        if (error) {
            console.error('Error deleting entries by dialect:', error);
            throw error;
        }
    },

    async deleteEntriesByCategory(category: string): Promise<void> {
        const { error } = await supabase
            .from('entries')
            .delete()
            .eq('category', category);

        if (error) {
            console.error('Error deleting entries by category:', error);
            throw error;
        }
    },

    async getDialects(): Promise<string[]> {
        const { data, error } = await supabase.from('dialects').select('name');
        if (error) {
            console.error('Error fetching dialects:', error);
            return [];
        }
        return data.map((d: { name: string }) => d.name);
    },

    async addDialect(name: string): Promise<void> {
        const { error } = await supabase.from('dialects').insert({ name });
        if (error) throw error;
    },

    async removeDialect(name: string): Promise<void> {
        const { error } = await supabase.from('dialects').delete().eq('name', name);
        if (error) throw error;
    },

    async getCategories(): Promise<string[]> {
        const { data, error } = await supabase.from('categories').select('name');
        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
        return data.map((c: { name: string }) => c.name);
    },

    async addCategory(name: string): Promise<void> {
        const { error } = await supabase.from('categories').insert({ name });
        if (error) throw error;
    },

    async removeCategory(name: string): Promise<void> {
        const { error } = await supabase.from('categories').delete().eq('name', name);
        if (error) throw error;
    }
};
