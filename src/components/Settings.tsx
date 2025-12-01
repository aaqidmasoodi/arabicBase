import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { supabase } from '../services/supabase';
import { Trash2, Settings as SettingsIcon, Globe, Tag, LogOut } from 'lucide-react';

export const Settings: React.FC = () => {
    const navigate = useNavigate();
    const {
        dialects, categories,
        globalDialects, globalCategories, loadGlobalData,
        addDialect, removeDialect,
        addCategory, removeCategory,
        user
    } = useStore();

    const [newDialect, setNewDialect] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [showDialectSuggestions, setShowDialectSuggestions] = useState(false);
    const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

    React.useEffect(() => {
        loadGlobalData();
    }, [loadGlobalData]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleAddDialect = (name: string) => {
        if (name.trim() && !dialects.includes(name.trim())) {
            addDialect(name.trim());
            setNewDialect('');
            setShowDialectSuggestions(false);
            // Refresh global data in case it was a new one
            setTimeout(loadGlobalData, 1000);
        }
    };

    const handleAddCategory = (name: string) => {
        if (name.trim() && !categories.includes(name.trim())) {
            addCategory(name.trim());
            setNewCategory('');
            setShowCategorySuggestions(false);
            // Refresh global data in case it was a new one
            setTimeout(loadGlobalData, 1000);
        }
    };

    const filteredDialects = globalDialects.filter(d =>
        d.toLowerCase().includes(newDialect.toLowerCase()) && !dialects.includes(d)
    );

    const filteredCategories = globalCategories.filter(c =>
        c.toLowerCase().includes(newCategory.toLowerCase()) && !categories.includes(c)
    );

    return (
        <div className="max-w-3xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <SettingsIcon size={24} className="text-gray-700 dark:text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuration</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Manage your profile and application settings.</p>
            </div>

            <div className="space-y-10">
                {/* User Profile Section */}
                {user && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                {user.email?.[0].toUpperCase()}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Signed in as</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white break-all">{user.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                >
                                    <LogOut size={18} className="mr-2" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </section>
                )}
                {/* Dialects Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Globe size={18} className="text-emerald-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dialects</h3>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-visible relative z-20">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <div className="relative">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newDialect}
                                        onChange={(e) => {
                                            setNewDialect(e.target.value);
                                            setShowDialectSuggestions(true);
                                        }}
                                        onFocus={() => setShowDialectSuggestions(true)}
                                        placeholder="Search or add new dialect..."
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                                    />
                                    <button
                                        onClick={() => handleAddDialect(newDialect)}
                                        disabled={!newDialect.trim()}
                                        className="px-3 py-2 md:px-4 text-white text-xs md:text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                {/* Autocomplete Dropdown */}
                                {showDialectSuggestions && newDialect && filteredDialects.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                                        {filteredDialects.map(d => (
                                            <button
                                                key={d}
                                                onClick={() => handleAddDialect(d)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {dialects.map((dialect) => (
                                <li key={dialect} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dialect}</span>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete the "${dialect}" dialect? This will also delete ALL entries associated with it.`)) {
                                                removeDialect(dialect);
                                            }
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                        title="Remove dialect"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Categories Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Tag size={18} className="text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-visible relative z-10">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <div className="relative">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => {
                                            setNewCategory(e.target.value);
                                            setShowCategorySuggestions(true);
                                        }}
                                        onFocus={() => setShowCategorySuggestions(true)}
                                        placeholder="Search or add new category..."
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm"
                                    />
                                    <button
                                        onClick={() => handleAddCategory(newCategory)}
                                        disabled={!newCategory.trim()}
                                        className="px-3 py-2 md:px-4 text-white text-xs md:text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                {/* Autocomplete Dropdown */}
                                {showCategorySuggestions && newCategory && filteredCategories.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                                        {filteredCategories.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => handleAddCategory(c)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {categories.map((category) => (
                                <li key={category} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete the "${category}" category? This will also delete ALL entries associated with it.`)) {
                                                removeCategory(category);
                                            }
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                        title="Remove category"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};
