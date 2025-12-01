import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mic, Database, ArrowRight, Check, Zap, Search, Play, Settings, Globe, Smartphone, Monitor, Layers, Share2, Sliders } from 'lucide-react';

// Import Screenshots
import myEntriesDesktop from '../assets/screenshots/my_entries_desktop.png';
import myEntriesMobile from '../assets/screenshots/my_entries_mobile.png';
import exploreDesktop from '../assets/screenshots/explore_desktop.png';
import exploreMobile from '../assets/screenshots/explore_mobile.png';
import configDesktop from '../assets/screenshots/config_desktop.png';
import configMobile from '../assets/screenshots/config_mobile.png';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    // State for device toggles per section
    const [entriesView, setEntriesView] = useState<'desktop' | 'mobile'>('desktop');
    const [exploreView, setExploreView] = useState<'desktop' | 'mobile'>('desktop');
    const [configView, setConfigView] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">

            {/* Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse duration-[10s]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[150px] animate-pulse duration-[15s]"></div>
                <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[150px] animate-pulse duration-[12s]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-xl shadow-lg shadow-emerald-900/10' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                            <span className="text-white font-bold text-xl">ع</span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">Arabic<span className="text-emerald-400">Base</span></span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:bg-white/10 transition-colors cursor-default backdrop-blur-sm">
                        <Sparkles size={14} />
                        <span className="tracking-wide uppercase text-xs font-bold">The Ultimate Arabic Vocabulary Builder</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Build Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-400 animate-gradient bg-300%">
                            Arabic Brain.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-light">
                        The only app designed for the complexity of Arabic dialects. <br className="hidden md:block" />
                        Capture words, record audio, and get AI insights for <span className="text-white font-medium">Levantine, Egyptian, Gulf, and MSA</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <button
                            onClick={() => navigate('/login')}
                            className="group w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                        >
                            Start Building Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                            <Play size={20} className="fill-white" />
                            See How It Works
                        </button>
                    </div>
                </div>
            </section>

            {/* Feature 1: Personal Dictionary */}
            <section className="py-32 px-6 bg-[#0A0A0A] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <div className="lg:w-1/2 space-y-8">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
                                <Database size={32} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Your Personal <br />
                                <span className="text-emerald-400">Dictionary.</span>
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                Stop using scattered notes and spreadsheets. ArabicBase gives you a structured, searchable home for every word you learn.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <Layers size={20} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Smart Organization</h3>
                                        <p className="text-gray-400">Tag entries by dialect (e.g., "Levantine"), category (e.g., "Food"), and root word.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <Search size={20} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Instant Search</h3>
                                        <p className="text-gray-400">Find any word in milliseconds, whether you type in Arabic, English, or transliteration.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual */}
                        <div className="lg:w-1/2 w-full">
                            <div className="relative bg-[#111] rounded-3xl border border-white/10 p-4 md:p-8 overflow-hidden group perspective-[2000px]">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50"></div>

                                {/* Device Toggle */}
                                <div className="flex justify-end mb-6">
                                    <div className="bg-black/50 p-1 rounded-lg border border-white/10 flex gap-1">
                                        <button
                                            onClick={() => setEntriesView('desktop')}
                                            className={`p-2 rounded-md transition-all ${entriesView === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Monitor size={18} />
                                        </button>
                                        <button
                                            onClick={() => setEntriesView('mobile')}
                                            className={`p-2 rounded-md transition-all ${entriesView === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Smartphone size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className={`relative transition-all duration-500 transform ${entriesView === 'mobile' ? 'max-w-[280px] mx-auto' : 'w-full'} rounded-xl overflow-hidden shadow-2xl border border-white/10 group-hover:rotate-x-2 transition-transform`}>
                                    <img
                                        src={entriesView === 'desktop' ? myEntriesDesktop : myEntriesMobile}
                                        alt="My Entries Interface"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 2: Explore Dialects */}
            <section className="py-32 px-6 bg-[#080808] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                        {/* Text Content */}
                        <div className="lg:w-1/2 space-y-8">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                                <Globe size={32} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Explore Global <br />
                                <span className="text-blue-400">Dialects.</span>
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                Don't limit yourself to one region. Discover words and phrases from across the Arab world, contributed by a community of learners.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <Share2 size={20} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Community Database</h3>
                                        <p className="text-gray-400">Access thousands of shared entries. See how a word is said in Cairo vs. Beirut.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <Zap size={20} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">One-Click Add</h3>
                                        <p className="text-gray-400">Found a useful word? Add it to your personal dictionary with a single click.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual */}
                        <div className="lg:w-1/2 w-full">
                            <div className="relative bg-[#111] rounded-3xl border border-white/10 p-4 md:p-8 overflow-hidden group perspective-[2000px]">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50"></div>

                                {/* Device Toggle */}
                                <div className="flex justify-end mb-6">
                                    <div className="bg-black/50 p-1 rounded-lg border border-white/10 flex gap-1">
                                        <button
                                            onClick={() => setExploreView('desktop')}
                                            className={`p-2 rounded-md transition-all ${exploreView === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Monitor size={18} />
                                        </button>
                                        <button
                                            onClick={() => setExploreView('mobile')}
                                            className={`p-2 rounded-md transition-all ${exploreView === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Smartphone size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className={`relative transition-all duration-500 transform ${exploreView === 'mobile' ? 'max-w-[280px] mx-auto' : 'w-full'} rounded-xl overflow-hidden shadow-2xl border border-white/10 group-hover:rotate-x-2 transition-transform`}>
                                    <img
                                        src={exploreView === 'desktop' ? exploreDesktop : exploreMobile}
                                        alt="Explore Interface"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 3: Fully Customizable */}
            <section className="py-32 px-6 bg-[#0A0A0A] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <div className="lg:w-1/2 space-y-8">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
                                <Settings size={32} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Fully <br />
                                <span className="text-purple-400">Customizable.</span>
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                ArabicBase adapts to YOUR learning journey. We don't force a curriculum on you; we give you the tools to build your own.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <Sliders size={20} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Custom Dialects & Tags</h3>
                                        <p className="text-gray-400">Learning a specific village dialect? Add it. Want to tag words by "TV Show" or "Book"? Go ahead.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <Check size={20} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Flexible Categories</h3>
                                        <p className="text-gray-400">Create categories that match your life. Work, Family, Travel, Politics—organize it your way.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual */}
                        <div className="lg:w-1/2 w-full">
                            <div className="relative bg-[#111] rounded-3xl border border-white/10 p-4 md:p-8 overflow-hidden group perspective-[2000px]">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50"></div>

                                {/* Device Toggle */}
                                <div className="flex justify-end mb-6">
                                    <div className="bg-black/50 p-1 rounded-lg border border-white/10 flex gap-1">
                                        <button
                                            onClick={() => setConfigView('desktop')}
                                            className={`p-2 rounded-md transition-all ${configView === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Monitor size={18} />
                                        </button>
                                        <button
                                            onClick={() => setConfigView('mobile')}
                                            className={`p-2 rounded-md transition-all ${configView === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Smartphone size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className={`relative transition-all duration-500 transform ${configView === 'mobile' ? 'max-w-[280px] mx-auto' : 'w-full'} rounded-xl overflow-hidden shadow-2xl border border-white/10 group-hover:rotate-x-2 transition-transform`}>
                                    <img
                                        src={configView === 'desktop' ? configDesktop : configMobile}
                                        alt="Configuration Interface"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works (Waveform Animation) */}
            <section className="py-32 px-6 relative overflow-hidden bg-[#050505]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Core Features</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Everything you need to master your dialect.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-[#111] p-8 rounded-3xl border border-white/10 relative group hover:border-emerald-500/30 transition-all">
                            <div className="absolute -top-6 -left-6 text-[120px] font-black text-white/5 select-none">1</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
                                    <Database size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Add a Word</h3>
                                <p className="text-gray-400">Input the Arabic word, meaning, and tag the dialect (e.g., "Levantine").</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-[#111] p-8 rounded-3xl border border-white/10 relative group hover:border-blue-500/30 transition-all">
                            <div className="absolute -top-6 -left-6 text-[120px] font-black text-white/5 select-none">2</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                    <Mic size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Record Audio</h3>
                                <p className="text-gray-400 mb-6">Capture the native pronunciation instantly.</p>

                                {/* Waveform Animation */}
                                <div className="flex items-center justify-center gap-1 h-12 bg-black/50 rounded-lg p-2 border border-white/5">
                                    {[...Array(15)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 bg-blue-500 rounded-full animate-music"
                                            style={{
                                                height: '20%',
                                                animationDelay: `${i * 0.05}s`,
                                                animationDuration: '0.8s'
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-[#111] p-8 rounded-3xl border border-white/10 relative group hover:border-purple-500/30 transition-all">
                            <div className="absolute -top-6 -left-6 text-[120px] font-black text-white/5 select-none">3</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Get AI Insights</h3>
                                <p className="text-gray-400">Our AI automatically generates example sentences, root words, and grammar notes.</p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-[#111] p-8 rounded-3xl border border-white/10 relative group hover:border-yellow-500/30 transition-all">
                            <div className="absolute -top-6 -left-6 text-[120px] font-black text-white/5 select-none">4</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 mb-6">
                                    <Search size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Search & Filter</h3>
                                <p className="text-gray-400">Instantly find words by dialect, category, or root. Never lose track of your vocabulary.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="py-24 px-6 bg-[#080808] border-y border-white/5">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Why ArabicBase */}
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Why ArabicBase?</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Most Arabic learning apps focus on Modern Standard Arabic (MSA), leaving you sounding like a news anchor in casual conversations. <strong className="text-white">ArabicBase is different.</strong> We built a tool that respects the rich diversity of the Arabic language. Whether you are learning the street slang of Cairo, the soft intonations of Beirut, or the formal eloquence of MSA, ArabicBase gives you the structure to master it all.
                        </p>
                    </div>

                    {/* Supported Dialects */}
                    <div>
                        <h3 className="text-2xl font-bold mb-8 text-center">Supported Dialects & Regions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: 'Levantine', region: 'Lebanon, Syria, Jordan, Palestine', flag: '🇱🇧' },
                                { name: 'Egyptian', region: 'Egypt', flag: '🇪🇬' },
                                { name: 'Gulf (Khaleeji)', region: 'Saudi Arabia, UAE, Kuwait, Qatar', flag: '🇸🇦' },
                                { name: 'Maghrebi (Darija)', region: 'Morocco, Algeria, Tunisia', flag: '🇲🇦' },
                            ].map((d) => (
                                <div key={d.name} className="bg-[#111] p-6 rounded-2xl border border-white/5 text-center hover:bg-white/5 transition-colors">
                                    <div className="text-4xl mb-3">{d.flag}</div>
                                    <div className="font-bold text-white mb-1">{d.name}</div>
                                    <div className="text-xs text-gray-500">{d.region}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customization Feature Highlight */}
                    <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 p-8 md:p-12 rounded-3xl border border-emerald-500/20 text-center">
                        <h3 className="text-3xl font-bold mb-4">Don't see your dialect? Add it.</h3>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            ArabicBase is fully configurable. Go to the <strong>Configuration</strong> page to add custom dialects, categories, and tags. It's your personal database, built your way.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-full font-bold transition-colors"
                        >
                            Start Customizing Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-32 px-6 relative">
                <div className="absolute inset-0 bg-emerald-900/5 skew-y-3 transform origin-bottom-right pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple Pricing. <br />Lifetime Value.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-[#111]/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
                            <div className="text-xl font-bold mb-2 text-gray-400">Starter</div>
                            <div className="text-5xl font-bold mb-6 text-white">$0</div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check size={20} className="text-emerald-500" />
                                    <span>100 Entries Limit</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check size={20} className="text-emerald-500" />
                                    <span>Basic AI Features</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Check size={20} className="text-emerald-500" />
                                    <span>Community Access</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
                            >
                                Get Started Free
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-gradient-to-b from-emerald-900/50 to-[#111] rounded-3xl p-8 border border-emerald-500/50 relative shadow-[0_0_50px_rgba(16,185,129,0.1)] transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 bg-emerald-500 text-black text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl">
                                BEST VALUE
                            </div>
                            <div className="text-xl font-bold mb-2 text-emerald-400">Pro Lifetime</div>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-bold text-white">$19</span>
                                <span className="text-gray-400 font-medium">Lifetime Access</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-400"><Check size={14} /></div>
                                    <span>Unlimited Entries</span>
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-400"><Check size={14} /></div>
                                    <span>Advanced AI Insights</span>
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-400"><Check size={14} /></div>
                                    <span>Priority Support</span>
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 bg-emerald-500/20 rounded-full text-emerald-400"><Check size={14} /></div>
                                    <span>Lifetime Updates</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                Get Lifetime Access
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center opacity-80">
                            <span className="text-white font-bold text-lg">ع</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">Arabic<span className="text-emerald-500">Base</span></span>
                    </div>
                    <div className="text-sm text-gray-500">
                        © 2024 ArabicBase. Crafted for learners.
                    </div>
                </div>
            </footer>

            {/* CSS for custom animations */}
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                @keyframes music {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
                .animate-music {
                    animation: music 1s ease-in-out infinite;
                }
                .perspective-[2000px] {
                    perspective: 2000px;
                }
                .rotate-x-2 {
                    transform: rotateX(2deg);
                }
                .group:hover .rotate-x-2 {
                    transform: rotateX(2deg) scale(1.02);
                }
            `}</style>
        </div>
    );
};
