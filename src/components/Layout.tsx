import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Globe, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../services/supabase';
import clsx from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme, toggleTheme, user } = useStore();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className={clsx("min-h-screen transition-colors duration-300", theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50')}>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-20 lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 z-20">
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

                    <div className="p-3 border-t border-gray-100 dark:border-gray-700/50 space-y-2">
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-center lg:justify-start px-3 lg:px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 transition-all"
                        >
                            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                            <span className="hidden lg:block ml-3 font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </button>

                        {user && (
                            <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                <div className="hidden lg:flex items-center px-4 py-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                    <div className="ml-3 overflow-hidden">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center lg:justify-start px-3 lg:px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                >
                                    <LogOut size={22} />
                                    <span className="hidden lg:block ml-3 font-medium">Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
