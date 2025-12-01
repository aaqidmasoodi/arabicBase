import React, { useState, useMemo } from 'react';
import { Search, Filter, Tag, Folder, X, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Entry } from '../types/entry';
import clsx from 'clsx';

interface ExploreProps {
    onEdit: (entry: Entry) => void;
}

const TYPES = ['All', 'word', 'phrase', 'idiom', 'slang', 'grammar', 'cultural', 'other'];

export const Explore: React.FC<ExploreProps> = () => {
    const { entries, dialects, categories } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDialect, setSelectedDialect] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const matchesSearch =
                entry.term.includes(searchQuery) ||
                entry.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesDialect = selectedDialect === 'All' || entry.dialect === selectedDialect;
            const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
            const matchesType = selectedType === 'All' || entry.type === selectedType;

            return matchesSearch && matchesDialect && matchesCategory && matchesType;
        }).sort((a, b) => a.term.localeCompare(b.term)); // Sort by term to group duplicates
    }, [entries, searchQuery, selectedDialect, selectedCategory, selectedType]);

    const toggleEntry = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedEntryId(prev => prev === id ? null : id);
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search words, meanings, tags..."
                    className="w-full p-3 pl-10 md:p-4 md:pl-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-base md:text-lg"
                />
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 md:w-6 md:h-6" size={20} />
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                    <Filter size={14} className="md:w-4 md:h-4" /> Filters
                </div>

                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <select
                        value={selectedDialect}
                        onChange={(e) => setSelectedDialect(e.target.value)}
                        className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs md:text-sm font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none min-w-[100px] md:min-w-[120px]"
                    >
                        <option value="All">All Dialects</option>
                        {dialects.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs md:text-sm font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none min-w-[100px] md:min-w-[120px]"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs md:text-sm font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none min-w-[100px] md:min-w-[120px]"
                    >
                        {TYPES.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
                    </select>
                </div>
            </div>

            {/* Results */}
            <div className="flex flex-wrap gap-3">
                {filteredEntries.map(entry => {
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
                                <div className="relative p-4 md:p-6 rounded-2xl bg-white dark:bg-gray-800 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-300">
                                    <button
                                        onClick={(e) => toggleEntry(entry.id, e)}
                                        className="absolute top-3 right-3 md:top-4 md:right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    >
                                        <X size={16} className="md:w-[18px] md:h-[18px]" />
                                    </button>

                                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4 mb-3 md:mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 md:gap-3 mb-1">
                                                <h3 className="font-bold text-2xl md:text-3xl font-arabic text-gray-900 dark:text-gray-50">{entry.term}</h3>
                                                <span className={clsx(
                                                    "text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 md:px-2 rounded-md border",
                                                    entry.type === 'word' ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800" :
                                                        entry.type === 'phrase' ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800" :
                                                            "bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                                                )}>
                                                    {entry.type}
                                                </span>
                                            </div>
                                            <p className="text-base md:text-lg text-emerald-600 dark:text-emerald-400 font-medium">{entry.transliteration}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 bg-gray-100 dark:bg-gray-700 rounded-full self-start">
                                            <Globe size={12} className="text-gray-500 dark:text-gray-400 md:w-3.5 md:h-3.5" />
                                            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">{entry.dialect}</span>
                                        </div>
                                    </div>

                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 border-l-4 border-emerald-500 pl-3 md:pl-4 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
                                            {entry.translation}
                                        </p>

                                        {entry.notes && (
                                            <div className="mt-3 md:mt-4 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                                                <strong className="text-gray-900 dark:text-gray-200">Notes:</strong> {entry.notes}
                                            </div>
                                        )}

                                        {entry.hasAiInsights && entry.aiEnrichment && (
                                            <div className="mt-3 md:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                {entry.aiEnrichment.exampleUsage && (
                                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-2.5 md:p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                                        <span className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">Example</span>
                                                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{entry.aiEnrichment.exampleUsage}</p>
                                                    </div>
                                                )}
                                                {entry.aiEnrichment.culturalContext && (
                                                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-2.5 md:p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
                                                        <span className="text-[10px] md:text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">Context</span>
                                                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{entry.aiEnrichment.culturalContext}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-3 md:mt-4 flex-wrap border-t border-gray-100 dark:border-gray-700 pt-3 md:pt-4">
                                        <span className="flex items-center text-[10px] md:text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full">
                                            <Folder size={10} className="mr-1 md:mr-1.5 opacity-70 md:w-3 md:h-3" /> {entry.category}
                                        </span>
                                        {entry.tags.map(tag => (
                                            <span key={tag} className="flex items-center text-[10px] md:text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full">
                                                <Tag size={10} className="mr-1 md:mr-1.5 opacity-70 md:w-3 md:h-3" /> {tag}
                                            </span>
                                        ))}
                                    </div>
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
                                        <div className="flex items-center gap-2">
                                            <span className="font-arabic font-bold text-base md:text-lg text-gray-800 dark:text-gray-200 leading-none mb-0.5">{entry.term}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                                                {entry.dialect}
                                            </span>
                                        </div>
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

                {filteredEntries.length === 0 && (
                    <div className="w-full text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No matches found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
