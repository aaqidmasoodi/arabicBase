
import React, { useState } from 'react';
import { ChevronRight, Folder, Tag, X, Trash2 } from 'lucide-react';
import type { Entry } from '../types/entry';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

interface EntryListProps {
    onEdit: (entry: Entry) => void;
}

export const EntryList: React.FC<EntryListProps> = ({ onEdit }) => {
    const { entries, deleteEntry, newlyAddedEntryId, clearNewlyAddedEntryId } = useStore();
    const [expandedDialects, setExpandedDialects] = useState<Record<string, boolean>>({});
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

    // Auto-expand newly added entry
    React.useEffect(() => {
        if (newlyAddedEntryId) {
            const entry = entries.find(e => e.id === newlyAddedEntryId);
            if (entry) {
                // Expand the dialect
                setExpandedDialects(prev => ({ ...prev, [entry.dialect]: true }));
                // Expand the category
                setExpandedCategories(prev => ({ ...prev, [`${entry.dialect}-${entry.category}`]: true }));
                // Expand the entry itself
                setExpandedEntryId(entry.id);

                // Clear the ID so it doesn't keep re-expanding if we close it
                // We use a small timeout to ensure the UI has updated first
                setTimeout(() => clearNewlyAddedEntryId(), 500);
            }
        }
    }, [newlyAddedEntryId, entries, clearNewlyAddedEntryId]);

    const toggleDialect = (dialect: string) => {
        setExpandedDialects(prev => ({ ...prev, [dialect]: !prev[dialect] }));
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const toggleEntry = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExpandedId = expandedEntryId === id ? null : id;
        setExpandedEntryId(newExpandedId);

        // If expanding, check if we need to fetch AI insights
        if (newExpandedId) {
            const entry = entries.find(ent => ent.id === newExpandedId);
            if (entry && !entry.hasAiInsights) {
                // Trigger on-demand enrichment
                useStore.getState().enrichEntry(entry);
            }
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            await deleteEntry(id);
            if (expandedEntryId === id) {
                setExpandedEntryId(null);
            }
        }
    };

    // Group entries by Dialect -> Category
    const groupedEntries = entries.reduce((acc, entry) => {
        if (!acc[entry.dialect]) acc[entry.dialect] = {};
        if (!acc[entry.dialect][entry.category]) acc[entry.dialect][entry.category] = [];
        acc[entry.dialect][entry.category].push(entry);
        return acc;
    }, {} as Record<string, Record<string, Entry[]>>);

    return (
        <div className="space-y-6">
            {Object.entries(groupedEntries).map(([dialect, categories]) => (
                <div key={dialect} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                    <button
                        onClick={() => toggleDialect(dialect)}
                        className="w-full flex items-center px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:from-gray-100 dark:hover:from-gray-700 transition-all duration-300"
                    >
                        <div className={clsx("p-1 rounded-full transition-transform duration-300", expandedDialects[dialect] ? "rotate-90 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "text-gray-400")}>
                            <ChevronRight size={18} className="md:w-5 md:h-5" />
                        </div>
                        <span className="ml-2 md:ml-3 font-bold text-base md:text-lg text-gray-800 dark:text-gray-100">{dialect}</span>
                        <span className="ml-auto text-[10px] md:text-xs font-medium px-2 py-0.5 md:px-3 md:py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 border border-gray-200 dark:border-gray-700">
                            {Object.values(categories).flat().length} entries
                        </span>
                    </button>

                    <div className={clsx("transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden", expandedDialects[dialect] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0")}>
                        <div className="p-2">
                            {Object.entries(categories).map(([category, categoryEntries]) => (
                                <div key={category} className="mb-2 last:mb-0">
                                    <button
                                        onClick={() => toggleCategory(`${dialect}-${category}`)}
                                        className="w-full flex items-center px-3 py-2 md:px-4 md:py-3 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all group"
                                    >
                                        <div className={clsx("mr-2 md:mr-3 transition-transform duration-200", expandedCategories[`${dialect}-${category}`] ? "rotate-90 text-emerald-500" : "text-gray-400 group-hover:text-gray-600")}>
                                            <ChevronRight size={14} className="md:w-4 md:h-4" />
                                        </div>
                                        <Folder size={16} className="mr-2 md:mr-3 text-emerald-500/80 group-hover:text-emerald-500 transition-colors md:w-[18px] md:h-[18px]" />
                                        <span className="font-medium text-sm md:text-base text-gray-700 dark:text-gray-200">{category}</span>
                                        <span className="ml-auto text-[10px] md:text-xs text-gray-400">{categoryEntries.length}</span>
                                    </button>

                                    <div className={clsx("transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden", expandedCategories[`${dialect}-${category}`] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0")}>
                                        <div className="ml-9 p-2 flex flex-wrap gap-3">
                                            {categoryEntries.map(entry => {
                                                const isExpanded = expandedEntryId === entry.id;
                                                return (
                                                    <div
                                                        key={entry.id}
                                                        className={clsx(
                                                            "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                                                            isExpanded ? "w-full" : "w-auto"
                                                        )}
                                                    >
                                                        {isExpanded ? (
                                                            <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-300">
                                                                <button
                                                                    onClick={(e) => toggleEntry(entry.id, e)}
                                                                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                                                >
                                                                    <X size={18} />
                                                                </button>

                                                                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-3 mb-1">
                                                                            <h3 className="font-bold text-3xl font-arabic text-gray-900 dark:text-gray-50">{entry.term}</h3>
                                                                            <span className={clsx(
                                                                                "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border",
                                                                                entry.type === 'word' ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800" :
                                                                                    entry.type === 'phrase' ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800" :
                                                                                        "bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                                                                            )}>
                                                                                {entry.type}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-lg text-emerald-600 dark:text-emerald-400 font-medium">{entry.transliteration}</p>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => onEdit(entry)}
                                                                            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => handleDelete(entry.id, e)}
                                                                            className="px-2.5 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                                            title="Delete Entry"
                                                                        >
                                                                            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="prose dark:prose-invert max-w-none">
                                                                    <p className="text-xl text-gray-700 dark:text-gray-300 border-l-4 border-emerald-500 pl-4 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
                                                                        {entry.translation}
                                                                    </p>

                                                                    {entry.notes && (
                                                                        <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                                                                            <strong className="text-gray-900 dark:text-gray-200">Notes:</strong> {entry.notes}
                                                                        </div>
                                                                    )}

                                                                    {entry.hasAiInsights && entry.aiEnrichment ? (
                                                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                            {entry.aiEnrichment.exampleUsage && (
                                                                                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                                                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">Example</span>
                                                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{entry.aiEnrichment.exampleUsage}</p>
                                                                                </div>
                                                                            )}
                                                                            {entry.aiEnrichment.culturalContext && (
                                                                                <div className="bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
                                                                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">Context</span>
                                                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{entry.aiEnrichment.culturalContext}</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        // Shimmer Loading State for AI Insights
                                                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                                                                            <div className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg h-24 border border-gray-200 dark:border-gray-700/50">
                                                                                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                                                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                                                                <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                                                            </div>
                                                                            <div className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg h-24 border border-gray-200 dark:border-gray-700/50">
                                                                                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                                                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                                                                <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {entry.tags.length > 0 && (
                                                                    <div className="flex gap-2 mt-4 flex-wrap border-t border-gray-100 dark:border-gray-700 pt-4">
                                                                        {entry.tags.map(tag => (
                                                                            <span key={tag} className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                                                                                <Tag size={12} className="mr-1.5 opacity-70" /> {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => toggleEntry(entry.id, e)}
                                                                className={clsx(
                                                                    "group flex items-center gap-3 px-4 py-3 md:px-5 md:py-3 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                                                                    "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                                                                    "hover:border-emerald-500 hover:shadow-md hover:scale-105",
                                                                    entry.type === 'word' ? "hover:bg-blue-50/50 dark:hover:bg-blue-900/20" :
                                                                        entry.type === 'phrase' ? "hover:bg-purple-50/50 dark:hover:bg-purple-900/20" :
                                                                            "hover:bg-gray-50 dark:hover:bg-gray-700"
                                                                )}
                                                            >
                                                                <div className="flex flex-col items-start">
                                                                    <span className="font-arabic font-bold text-base md:text-lg text-gray-800 dark:text-gray-200 leading-none mb-0.5">{entry.term}</span>
                                                                    <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">{entry.translation}</span>
                                                                </div>
                                                                <span className={clsx(
                                                                    "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0",
                                                                    entry.type === 'word' ? "bg-blue-400" :
                                                                        entry.type === 'phrase' ? "bg-purple-400" :
                                                                            "bg-gray-400"
                                                                )} />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            {entries.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Folder size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No entries yet</h3>
                    <p className="text-gray-500 mt-1">Click the + button to add your first entry.</p>
                </div>
            )}
        </div>
    );
};
