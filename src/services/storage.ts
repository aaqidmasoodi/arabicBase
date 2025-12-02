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

    async getGlobalEntries(): Promise<Entry[]> {
        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error('Error fetching global entries:', error);
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
        // 1. Handle Concept Linking
        let conceptId = null;
        if (entry.translation) {
            const normalizedTranslation = entry.translation.trim().toLowerCase();

            // Check if concept exists
            const { data: existingConcept } = await supabase
                .from('concepts')
                .select('id')
                .eq('name', normalizedTranslation)
                .single();

            if (existingConcept) {
                conceptId = existingConcept.id;
            } else {
                // Create new concept
                const { data: newConcept, error: conceptError } = await supabase
                    .from('concepts')
                    .insert({ name: normalizedTranslation })
                    .select('id')
                    .single();

                if (!conceptError && newConcept) {
                    conceptId = newConcept.id;
                } else if (conceptError?.code === '23505') {
                    // Handle race condition: created by someone else in the meantime
                    const { data: retryConcept } = await supabase
                        .from('concepts')
                        .select('id')
                        .eq('name', normalizedTranslation)
                        .single();
                    if (retryConcept) conceptId = retryConcept.id;
                }
            }
        }

        // 2. Upsert Entry
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
                updated_at: new Date().toISOString(),
                concept_id: conceptId
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('user_dialects')
            .select('dialects(name)')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching dialects:', error);
            return [];
        }
        return data.map((d: any) => d.dialects.name);
    },

    async addDialect(name: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // 1. Ensure dialect exists globally
        let dialectId: string;
        const { data: existing } = await supabase.from('dialects').select('id').eq('name', name).single();

        if (existing) {
            dialectId = existing.id;
        } else {
            const { data: newDialect, error } = await supabase.from('dialects').insert({ name }).select('id').single();
            if (error) throw error;
            dialectId = newDialect.id;
        }

        // 2. Link to user
        const { error: linkError } = await supabase.from('user_dialects').insert({
            user_id: user.id,
            dialect_id: dialectId
        });

        if (linkError && linkError.code !== '23505') { // Ignore unique violation (already linked)
            throw linkError;
        }
    },

    async removeDialect(name: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Get dialect ID
        const { data: dialect } = await supabase.from('dialects').select('id').eq('name', name).single();
        if (!dialect) return;

        // Remove link ONLY
        const { error } = await supabase
            .from('user_dialects')
            .delete()
            .eq('user_id', user.id)
            .eq('dialect_id', dialect.id);

        if (error) throw error;
    },

    async getCategories(): Promise<string[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('user_categories')
            .select('categories(name)')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
        return data.map((c: any) => c.categories.name);
    },

    async addCategory(name: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // 1. Ensure category exists globally
        let categoryId: string;
        const { data: existing } = await supabase.from('categories').select('id').eq('name', name).single();

        if (existing) {
            categoryId = existing.id;
        } else {
            const { data: newCategory, error } = await supabase.from('categories').insert({ name }).select('id').single();
            if (error) throw error;
            categoryId = newCategory.id;
        }

        // 2. Link to user
        const { error: linkError } = await supabase.from('user_categories').insert({
            user_id: user.id,
            category_id: categoryId
        });

        if (linkError && linkError.code !== '23505') { // Ignore unique violation
            throw linkError;
        }
    },

    async removeCategory(name: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Get category ID
        const { data: category } = await supabase.from('categories').select('id').eq('name', name).single();
        if (!category) return;

        // Remove link ONLY
        const { error } = await supabase
            .from('user_categories')
            .delete()
            .eq('user_id', user.id)
            .eq('category_id', category.id);

        if (error) throw error;
    },

    async getProfile(userId: string): Promise<{ is_pro: boolean } | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    },

    async getGlobalDialects(): Promise<string[]> {
        const { data, error } = await supabase
            .from('dialects')
            .select('name')
            .order('name');

        if (error) {
            console.error('Error fetching global dialects:', error);
            return [];
        }
        return data.map(d => d.name);
    },

    async getGlobalCategories(): Promise<string[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('name')
            .order('name');

        if (error) {
            console.error('Error fetching global categories:', error);
            return [];
        }
        return data.map(c => c.name);
    },

    async getGlobalConcepts(): Promise<string[]> {
        const { data, error } = await supabase
            .from('concepts')
            .select('name')
            .order('name');

        if (error) {
            console.error('Error fetching global concepts:', error);
            return [];
        }
        return data.map(c => c.name);
    },

    async voteEntry(entryId: string, voteType: 'up' | 'down'): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('entry_votes')
            .upsert({
                user_id: user.id,
                entry_id: entryId,
                vote_type: voteType
            });

        if (error) {
            console.error('Error voting on entry:', error);
            throw error;
        }
    },

    async removeVote(entryId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('entry_votes')
            .delete()
            .eq('user_id', user.id)
            .eq('entry_id', entryId);

        if (error) {
            console.error('Error removing vote:', error);
            throw error;
        }
    },

    async getUserVotes(): Promise<Record<string, 'up' | 'down'>> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return {};

        const { data, error } = await supabase
            .from('entry_votes')
            .select('entry_id, vote_type')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching user votes:', error);
            return {};
        }

        return data.reduce((acc: any, vote: any) => {
            acc[vote.entry_id] = vote.vote_type;
            return acc;
        }, {});
    }
};
