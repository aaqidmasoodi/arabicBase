import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Globe, Settings, Moon, Sun, Sparkles, Crown } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
    onUpgrade: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onUpgrade }) => {
    const { theme, toggleTheme, isPro, entries } = useStore();
    const entryCount = entries.length;
    const limit = 100;
    const percentage = Math.min((entryCount / limit) * 100, 100);

    return (
        <div className={clsx("min-h-screen transition-colors duration-300", theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50')}>
            <div className="flex h-screen overflow-hidden flex-col md:flex-row">

                {/* Mobile Top Bar */}
                <header className="md:hidden h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-20 shrink-0">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-white font-bold text-lg">ع</span>
                        </div>
                        <span className="ml-2 font-bold text-lg text-gray-800 dark:text-white tracking-tight">Arabic<span className="text-emerald-500">Base</span></span>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    {!isPro && (
                        <button
                            onClick={onUpgrade}
                            className="ml-2 p-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-full"
                        >
                            <Sparkles size={20} />
                        </button>
                    )}
                </header>

                {/* Desktop Sidebar */}
                <aside className="hidden md:flex w-20 lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col transition-all duration-300 z-20">
                    <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-100 dark:border-gray-700/50">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-white font-bold text-xl">ع</span>
                        </div>
                        <span className="hidden lg:block ml-3 font-bold text-xl text-gray-800 dark:text-white tracking-tight">Arabic<span className="text-emerald-500">Base</span></span>
                    </div>

                    <nav className="flex-1 py-6 px-3 space-y-2">
                        <NavLink
                            to="/"
                            className={({ isActive }) => clsx(
                                "flex items-center px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            <LayoutGrid size={22} />
                            <span className="hidden lg:block ml-3 font-medium">My Entries</span>
                        </NavLink>

                        <NavLink
                            to="/explore"
                            className={({ isActive }) => clsx(
                                "flex items-center px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            <Globe size={22} />
                            <span className="hidden lg:block ml-3 font-medium">Explore</span>
                        </NavLink>

                        <NavLink
                            to="/settings"
                            className={({ isActive }) => clsx(
                                "flex items-center px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            <Settings size={22} />
                            <span className="hidden lg:block ml-3 font-medium">Configuration</span>
                        </NavLink>
                    </nav>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-700/50 space-y-4">
                        {!isPro ? (
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Free Plan</span>
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{entryCount} / {limit}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
                                    <div
                                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <button
                                    onClick={onUpgrade}
                                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={14} />
                                    Upgrade to Pro
                                </button>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <Crown size={16} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">Pro Member</div>
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400">Unlimited Access</div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-center lg:justify-start px-3 lg:px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 transition-all"
                        >
                            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                            <span className="hidden lg:block ml-3 font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-30">
                    <div className="flex justify-around items-center h-16">
                        <NavLink
                            to="/"
                            className={({ isActive }) => clsx(
                                "flex flex-col items-center justify-center w-full h-full transition-colors",
                                isActive
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            )}
                        >
                            <LayoutGrid size={24} />
                            <span className="text-[10px] font-medium mt-1">Entries</span>
                        </NavLink>

                        <NavLink
                            to="/explore"
                            className={({ isActive }) => clsx(
                                "flex flex-col items-center justify-center w-full h-full transition-colors",
                                isActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            )}
                        >
                            <Globe size={24} />
                            <span className="text-[10px] font-medium mt-1">Explore</span>
                        </NavLink>

                        <NavLink
                            to="/settings"
                            className={({ isActive }) => clsx(
                                "flex flex-col items-center justify-center w-full h-full transition-colors",
                                isActive
                                    ? "text-purple-600 dark:text-purple-400"
                                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            )}
                        >
                            <Settings size={24} />
                            <span className="text-[10px] font-medium mt-1">Config</span>
                        </NavLink>
                    </div>
                </nav>
            </div>
        </div>
    );
};
