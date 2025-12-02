import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Search, Globe, Plus, Check, X, Folder, Tag, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import type { Entry } from '../types/entry';

export const Database: React.FC = () => {
    const { globalEntries, loadGlobalEntries, loadGlobalData, forkEntry, user, globalDialects, globalCategories, globalConcepts, entries } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDialect, setSelectedDialect] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedConcept, setSelectedConcept] = useState('All');
    const [forkedEntries, setForkedEntries] = useState<Set<string>>(new Set());
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

    useEffect(() => {
        loadGlobalEntries();
        loadGlobalData();
    }, [loadGlobalEntries, loadGlobalData]);

    const filteredEntries = useMemo(() => {
        return globalEntries.filter(entry => {
            const matchesSearch =
                entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.transliteration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDialect = selectedDialect === 'All' || entry.dialect === selectedDialect;
            const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
            // Filter by concept (assuming translation matches concept name for now)
            const matchesConcept = selectedConcept === 'All' || entry.translation.toLowerCase() === selectedConcept.toLowerCase();

            return matchesSearch && matchesDialect && matchesCategory && matchesConcept;
        });
    }, [globalEntries, searchTerm, selectedDialect, selectedCategory, selectedConcept]);

    // Check if an entry is already in the user's library
    const isEntryInLibrary = (entry: Entry) => {
        return entries.some(e =>
            e.term === entry.term &&
            e.translation === entry.translation &&
            e.dialect === entry.dialect
        );
    };

    const handleFork = async (entry: Entry, e: React.MouseEvent) => {
        e.stopPropagation();
        if (forkedEntries.has(entry.id) || isEntryInLibrary(entry)) return;

        await forkEntry(entry);
        setForkedEntries(prev => new Set(prev).add(entry.id));

        // Show temporary success state
        setTimeout(() => {
            setForkedEntries(prev => {
                const next = new Set(prev);
                next.delete(entry.id);
                return next;
            });
        }, 2000);
    };

    const toggleEntry = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedEntryId(prev => prev === id ? null : id);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header Section */}
            <div className="mb-8 text-center space-y-3">
                <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20 mb-2">
                    <Globe size={20} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Global Database
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Explore the collective knowledge of the community.
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="sticky top-20 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg mb-6 transition-all duration-300">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search words, meanings..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-sm"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            <select
                                value={selectedDialect}
                                onChange={(e) => setSelectedDialect(e.target.value)}
                                className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/50 outline-none min-w-[120px] text-sm"
                            >
                                <option value="All">All Dialects</option>
                                {globalDialects.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/50 outline-none min-w-[120px] text-sm"
                            >
                                <option value="All">All Categories</option>
                                {globalCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Concept Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-t border-gray-100 dark:border-gray-800 pt-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0 mr-2">
                            <Sparkles size={14} /> Concepts:
                        </div>
                        <button
                            onClick={() => setSelectedConcept('All')}
                            className={clsx(
                                "px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 border",
                                selectedConcept === 'All'
                                    ? "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
                            )}
                        >
                            All
                        </button>
                        {globalConcepts.map(concept => (
                            <button
                                key={concept}
                                onClick={() => setSelectedConcept(selectedConcept === concept ? 'All' : concept)} // Toggle
                                className={clsx(
                                    "px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 border",
                                    selectedConcept === concept
                                        ? "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
                                )}
                            >
                                {concept}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Entries Grid (Pills Layout) */}
            <div className="flex flex-wrap gap-3 pb-24">
                {filteredEntries.map(entry => {
                    const isExpanded = expandedEntryId === entry.id;
                    const inLibrary = isEntryInLibrary(entry);
                    const isAdded = forkedEntries.has(entry.id) || inLibrary;

                    return (
                        <div
                            key={entry.id}
                            className={clsx(
                                "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                                isExpanded ? "w-full" : "w-auto"
                            )}
                        >
                            {isExpanded ? (
                                <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 animate-in fade-in zoom-in-95 duration-300">
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
                                            <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">{entry.transliteration}</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full self-start">
                                            <Globe size={14} className="text-gray-500 dark:text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{entry.dialect}</span>
                                        </div>
                                    </div>

                                    <div className="prose dark:prose-invert max-w-none mb-6">
                                        <p className="text-xl text-gray-700 dark:text-gray-300 border-l-4 border-indigo-500 pl-4 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
                                            {entry.translation}
                                        </p>

                                        {entry.notes && (
                                            <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                                                <strong className="text-gray-900 dark:text-gray-200">Notes:</strong> {entry.notes}
                                            </div>
                                        )}

                                        {entry.hasAiInsights && entry.aiEnrichment && (
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
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4">
                                        <div className="flex gap-2 flex-wrap">
                                            <span className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                                                <Folder size={12} className="mr-1.5 opacity-70" /> {entry.category}
                                            </span>
                                            {entry.tags?.map(tag => (
                                                <span key={tag} className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                                                    <Tag size={12} className="mr-1.5 opacity-70" /> {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {user && entry.userId !== user.id && (
                                            <button
                                                onClick={(e) => handleFork(entry, e)}
                                                disabled={isAdded}
                                                className={clsx(
                                                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm",
                                                    isAdded
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default"
                                                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                                                )}
                                            >
                                                {isAdded ? (
                                                    <>
                                                        <Check size={16} /> {inLibrary ? 'In Knowledge Base' : 'Added'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={16} /> Add to Knowledge Base
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => toggleEntry(entry.id, e)}
                                    className={clsx(
                                        "group flex items-center gap-3 px-5 py-3 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                                        "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                                        "hover:border-indigo-500 hover:shadow-md hover:scale-105",
                                        entry.type === 'word' ? "hover:bg-blue-50/50 dark:hover:bg-blue-900/20" :
                                            entry.type === 'phrase' ? "hover:bg-purple-50/50 dark:hover:bg-purple-900/20" :
                                                "hover:bg-gray-50 dark:hover:bg-gray-700"
                                    )}
                                >
                                    <div className="flex flex-col items-start text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="font-arabic font-bold text-lg text-gray-800 dark:text-gray-200 leading-none mb-0.5">{entry.term}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                                                {entry.dialect}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{entry.transliteration}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{entry.translation}</span>
                                        </div>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <span className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded-md border border-gray-100 dark:border-gray-700/50">
                                                <Folder size={10} className="mr-1 opacity-70" /> {entry.category}
                                            </span>
                                        </div>
                                    </div>
                                    {user && entry.userId !== user.id && (
                                        <div
                                            onClick={(e) => handleFork(entry, e)}
                                            className={clsx(
                                                "ml-2 p-1.5 rounded-full transition-colors",
                                                isAdded
                                                    ? "text-green-500 bg-green-50 dark:bg-green-900/20 cursor-default"
                                                    : "text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                            )}
                                            title={isAdded ? "Already in Knowledge Base" : "Add to Knowledge Base"}
                                        >
                                            {isAdded ? <Check size={14} /> : <Plus size={14} />}
                                        </div>
                                    )}
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
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No entries found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
