export interface Entry {
    id: string;
    term: string; // Arabic text
    transliteration: string;
    translation: string;
    dialect: string; // e.g., "Levantine", "Egyptian", "MSA"
    category: string; // e.g., "Greeting", "Food", "Travel"
    type: "word" | "phrase" | "idiom" | "slang" | "grammar" | "cultural" | "other";
    tags: string[];
    notes: string;
    audioBlob?: Blob; // For local playback
    aiEnrichment?: {
        synonyms: string[];
        exampleUsage: string;
        culturalContext: string;
        grammaticalNotes?: string;
    };
    hasAiInsights?: boolean;
    userId?: string;
    upvotes?: number;
    downvotes?: number;
    createdAt: number;
    updatedAt: number;
}
