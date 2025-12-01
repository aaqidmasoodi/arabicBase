import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Settings as SettingsIcon, Globe, Tag } from 'lucide-react';

export const Settings: React.FC = () => {
    const { dialects, categories, addDialect, removeDialect, addCategory, removeCategory } = useStore();
    const [newDialect, setNewDialect] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const handleAddDialect = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDialect.trim() && !dialects.includes(newDialect.trim())) {
            addDialect(newDialect.trim());
            setNewDialect('');
        }
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            addCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <SettingsIcon size={24} className="text-gray-700 dark:text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuration</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Manage the available options for your entries. These settings directly affect the Entry Form.</p>
            </div>

            <div className="space-y-10">
                {/* Dialects Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Globe size={18} className="text-emerald-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dialects</h3>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <form onSubmit={handleAddDialect} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newDialect}
                                    onChange={(e) => setNewDialect(e.target.value)}
                                    placeholder="Add new dialect (e.g. Levantine)"
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!newDialect.trim()}
                                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add
                                </button>
                            </form>
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

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <form onSubmit={handleAddCategory} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Add new category (e.g. Food)"
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!newCategory.trim()}
                                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add
                                </button>
                            </form>
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
