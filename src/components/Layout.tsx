import React, { useEffect } from 'react';
import { Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme, toggleTheme } = useStore();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className={clsx(
            'min-h-screen transition-colors duration-500 ease-in-out',
            theme === 'dark'
                ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black text-white'
                : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-gray-50 to-white text-gray-900'
        )}>
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>

            <header className="sticky top-0 z-50 border-b border-white/10 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-white font-bold text-xl font-arabic">ع</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
                            Arabic<span className="font-light">Base</span>
                        </h1>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-xl bg-gray-100/50 dark:bg-white/5 hover:bg-gray-200/50 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-md border border-white/20 shadow-sm group"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light'
                            ? <Moon size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                            : <Sun size={20} className="text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                        }
                    </button>
                </div>
            </header>
            <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe">
                <div className="max-w-md mx-auto flex justify-around items-center h-16">
                    <NavLink
                        to="/"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full transition-colors",
                            isActive
                                ? "text-emerald-600 dark:text-emerald-500"
                                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={clsx("mb-1 transition-transform", isActive && "scale-110")}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                </div>
                                <span className="text-[10px] font-medium">Home</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/explore"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full transition-colors",
                            isActive
                                ? "text-emerald-600 dark:text-emerald-500"
                                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={clsx("mb-1 transition-transform", isActive && "scale-110")}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                                <span className="text-[10px] font-medium">Explore</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center justify-center w-full h-full transition-colors",
                            isActive
                                ? "text-emerald-600 dark:text-emerald-500"
                                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={clsx("mb-1 transition-transform", isActive && "scale-110")}>
                                    <SettingsIcon size={24} strokeWidth={2} />
                                </div>
                                <span className="text-[10px] font-medium">Settings</span>
                            </>
                        )}
                    </NavLink>
                </div>
            </nav>
        </div>
    );
};
